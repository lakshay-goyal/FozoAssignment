import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')

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
          await setActive({ session: sessionId })
          router.replace('/')
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
      <View className="flex-1 p-6 bg-white">
        <Text className="text-2xl font-bold mb-6">Verify your email</Text>

        {error ? (
          <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <Text className="text-red-600 text-sm">{error}</Text>
          </View>
        ) : null}

        <TextInput
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => {
            setCode(code)
            setError('')
          }}
          className="border border-gray-300 rounded-lg p-3 mb-4"
        />
        <TouchableOpacity
          onPress={onVerifyPress}
          className="bg-blue-500 rounded-lg p-3 mb-4"
        >
          <Text className="text-white text-center font-semibold">Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-6">Sign up</Text>

      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      ) : null}

      <TextInput
        autoCapitalize="none"
        value={username}
        placeholder="Enter username"
        onChangeText={(username) => {
          setUsername(username)
          setError('')
        }}
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(email) => {
          setEmailAddress(email)
          setError('')
        }}
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => {
          setPassword(password)
          setError('')
        }}
        className="border border-gray-300 rounded-lg p-3 mb-4"
      />
      <TouchableOpacity
        onPress={onSignUpPress}
        className="bg-blue-500 rounded-lg p-3 mb-4"
      >
        <Text className="text-white text-center font-semibold">Continue</Text>
      </TouchableOpacity>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        <Text>Already have an account? </Text>
        <Link href="./sign-in">
          <Text className="text-blue-500">Sign in</Text>
        </Link>
      </View>
    </View>
  )
}