import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { BurgerBackground } from '@/components/BurgerBackground'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'

const { height } = Dimensions.get('window')
const MIN_HEIGHT = height * 0.5
const MAX_HEIGHT = height

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const cardHeight = useSharedValue(MIN_HEIGHT)
  const startHeight = useSharedValue(MIN_HEIGHT)

  const getErrorMessage = (err: any): string => {
    if (err?.errors && err.errors.length > 0) {
      return err.errors[0].message || err.errors[0].longMessage || 'An error occurred'
    }
    if (err?.message) {
      return err.message
    }
    return 'An unexpected error occurred. Please try again.'
  }

  /* ---------------- DRAG GESTURE ---------------- */
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      startHeight.value = cardHeight.value
    })
    .onUpdate((e) => {
      const nextHeight = startHeight.value - e.translationY
      if (nextHeight >= MIN_HEIGHT && nextHeight <= MAX_HEIGHT) {
        cardHeight.value = nextHeight
      }
    })
    .onEnd(() => {
      if (cardHeight.value > height * 0.75) {
        cardHeight.value = withSpring(MAX_HEIGHT)
        runOnJS(setIsExpanded)(true)
      } else {
        cardHeight.value = withSpring(MIN_HEIGHT)
        runOnJS(setIsExpanded)(false)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    height: cardHeight.value,
  }))

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
        {/* TOP HERO */}
        <View className="flex-1">
          <BurgerBackground />
        </View>

        {/* DRAGGABLE BOTTOM CARD */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={animatedStyle}
            className={`absolute bottom-0 w-full bg-white rounded-t-3xl px-6 pb-8 ${
              isExpanded ? 'justify-center' : 'pt-6'
            }`}
          >
            <View className={isExpanded ? 'items-center' : ''}>
              {/* HANDLE */}
              {!isExpanded && (
                <View className="w-10 h-1 bg-gray-400 rounded-full self-center mb-4" />
              )}

              <Text className="text-xl font-bold text-center mb-6 text-gray-800">
                Verify your email
              </Text>

              {error ? (
                <View className="bg-red-100 border border-red-300 rounded-xl p-3 mb-4 w-full">
                  <Text className="text-red-700 text-sm">{error}</Text>
                </View>
              ) : null}

              <TextInput
                value={code}
                placeholder="Enter your verification code"
                onChangeText={(code) => {
                  setCode(code)
                  setError('')
                }}
                className="border border-gray-400 rounded-xl p-4 mb-4 bg-white w-full"
              />
              <TouchableOpacity
                onPress={onVerifyPress}
                className="bg-[#D6EE72] rounded-xl py-4 mb-4 w-full"
              >
                <Text className="text-center font-semibold text-gray-900">
                  Verify
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-[#D6EE72]">
      {/* TOP HERO */}
      <View className="flex-1">
        <BurgerBackground />
      </View>

      {/* DRAGGABLE BOTTOM CARD */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={animatedStyle}
          className={`absolute bottom-0 w-full bg-white rounded-t-3xl px-6 pb-8 ${
            isExpanded ? 'justify-center' : 'pt-6'
          }`}
        >
          <View className={isExpanded ? 'items-center' : ''}>
            {/* HANDLE */}
            {!isExpanded && (
              <View className="w-10 h-1 bg-gray-400 rounded-full self-center mb-4" />
            )}

            <Text className="text-xl font-bold text-center mb-6 text-gray-800">
              Sign up to continue
            </Text>

            {error ? (
              <View className="bg-red-100 border border-red-300 rounded-xl p-3 mb-4 w-full">
                <Text className="text-red-700 text-sm">{error}</Text>
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
              className="border border-gray-400 rounded-xl p-4 mb-4 bg-white w-full"
            />
            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              onChangeText={(email) => {
                setEmailAddress(email)
                setError('')
              }}
              className="border border-gray-400 rounded-xl p-4 mb-4 bg-white w-full"
            />
            <TextInput
              value={password}
              placeholder="Enter password"
              secureTextEntry={true}
              onChangeText={(password) => {
                setPassword(password)
                setError('')
              }}
              className="border border-gray-400 rounded-xl p-4 mb-6 bg-white w-full"
            />
            <TouchableOpacity
              onPress={onSignUpPress}
              className="bg-[#D6EE72] rounded-xl py-4 mb-4 w-full"
            >
              <Text className="text-center font-semibold text-gray-900">
                Continue
              </Text>
            </TouchableOpacity>
            <View className="flex-row justify-center">
              <Text className="text-gray-700">Already have an account? </Text>
              <Link href="./sign-in">
                <Text className="font-semibold text-gray-900">Sign in</Text>
              </Link>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}