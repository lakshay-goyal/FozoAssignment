import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { BurgerBackground } from '@/components/BurgerBackground'
import { DraggableCard } from '@/components/DraggableCard'
import { InputFeild } from '@/components/InputFeild'
import { Button } from '@/components/Button'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')


  const getErrorMessage = (err: any): string => {
    if (err?.errors && err.errors.length > 0) {
      return err.errors[0].message || err.errors[0].longMessage || 'An error occurred'
    }
    if (err?.message) {
      return err.message
    }
    return 'An unexpected error occurred. Please try again.'
  }

  const onSignUpPress = async () => {
    if (!isLoaded) return

    setError('')

    try {
      await signUp.create({
        emailAddress,
        username,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    setError('')

    try {
      await signUp.attemptEmailAddressVerification({
        code,
      })

      if (signUp.status === 'missing_requirements') {
        if (signUp.missingFields?.includes('username') && username) {
          await signUp.update({ username })
        }
      }

      if (signUp.status === 'complete') {
        const sessionId = signUp.createdSessionId
        if (sessionId) {
          try {
            // Get user location
            const { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
              setError('Location permission is required. Please enable it in settings.')
              return
            }
            const location = await Location.getCurrentPositionAsync({})
            const { latitude, longitude } = location.coords

            
            // Store the user Data into the database
            const userEmail = signUp.emailAddress || emailAddress
            const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL
            if (!backendUrl) {
              setError('Backend URL is not configured. Please check your .env file.')
              return
            }

            const response = await fetch(`${backendUrl}/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username,
                email: userEmail,
                latitude,
                longitude,
              }),
            })

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ error: 'Failed to create user' }))
              throw new Error(errorData.error || 'Failed to create user in backend')
            }

            // User created successfully, now set active session
            await setActive({ session: sessionId })
            router.replace('/')
          } catch (locationErr: any) {
            console.error('Error getting location or creating user:', locationErr)
            setError(locationErr.message || 'Failed to get location or create user. Please try again.')
          }
        } else {
          setError('Verification successful, but no session was created. Please try signing in.')
        }
      } else {
        if (signUp.status === 'missing_requirements' && signUp.missingFields?.includes('username')) {
          setError('Username is required. Please go back and provide a username.')
        } else {
          console.log('Sign-up status after verification:', signUp.status)
          console.log('Missing fields:', signUp.missingFields)

          setError(`Verification completed, but sign-up status is: ${signUp.status}. Missing fields: ${signUp.missingFields?.join(', ') || 'none'}.`)
        }
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
    }
  }

  if (pendingVerification) {
    return (
      <View className="flex-1 bg-[#D6EE72]">
        {/* Background */}
        <View className="flex-1">
          <BurgerBackground />
        </View>

        {/* Verify Email Card */}
        <DraggableCard title="Verify your email">
          {error ? (
            <View className="bg-red-100 border border-red-300 rounded-xl p-3 mb-4 w-full">
              <Text className="font-sans text-red-700 text-sm">{error}</Text>
            </View>
          ) : null}

          <InputFeild
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code: string) => {
              setCode(code)
              setError('')
            }}
          />
          <Button title="Verify" onPress={onVerifyPress} />
        </DraggableCard>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#D6EE72]">
      {/* Background */}
      <View className="flex-1">
        <BurgerBackground />
      </View>

      {/* Sign-Up-Form */}
        <DraggableCard title="Sign up to continue">
        {error ? (
          <View className="bg-red-100 border border-red-300 rounded-xl p-3 mb-4 w-full">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        ) : null}

        <InputFeild
          value={username}
          placeholder="Enter username"
          onChangeText={(username: string) => {
            setUsername(username)
            setError('')
          }}
          secureTextEntry={false}
        />
        <InputFeild
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email: string) => {
            setEmailAddress(email)
            setError('')
          }}
          secureTextEntry={false}
        />
        <InputFeild
          value={password}
          placeholder="Enter password"
          onChangeText={(password: string) => {
            setPassword(password)
            setError('')
          }}
          secureTextEntry={true}
        />
        <Button title="Sign up" onPress={onSignUpPress} />
        <View className="flex-row justify-center">
          <Text className="font-sans text-gray-700">Already have an account? </Text>
          <Link href="./sign-in">
            <Text className="font-sans font-bold text-gray-900">Sign in</Text>
          </Link>
        </View>
      </DraggableCard>
    </View>
  )
}