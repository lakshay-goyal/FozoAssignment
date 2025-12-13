import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'
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

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const cardHeight = useSharedValue(MIN_HEIGHT)
  const startHeight = useSharedValue(MIN_HEIGHT)

  const getErrorMessage = (err: any): string => {
    if (err?.errors?.length) return err.errors[0].message
    return err?.message || 'Something went wrong'
  }

  const onSignInPress = async () => {
    if (!isLoaded) return
    setError('')

    try {
      const attempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId })
        router.replace('/')
      }
    } catch (err: any) {
      setError(getErrorMessage(err))
    }
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
              Sign in to continue
            </Text>

            {error ? (
              <View className="bg-red-100 border border-red-300 rounded-xl p-3 mb-4 w-full">
                <Text className="text-red-700 text-sm">{error}</Text>
              </View>
            ) : null}

            <TextInput
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter email"
              onChangeText={(t) => {
                setEmailAddress(t)
                setError('')
              }}
              className="border border-gray-400 rounded-xl p-4 mb-4 bg-white w-full"
            />

            <TextInput
              value={password}
              placeholder="Enter password"
              secureTextEntry
              onChangeText={(t) => {
                setPassword(t)
                setError('')
              }}
              className="border border-gray-400 rounded-xl p-4 mb-6 bg-white w-full"
            />

            <TouchableOpacity
              onPress={onSignInPress}
              className="bg-[#D6EE72] rounded-xl py-4 mb-4 w-full"
            >
              <Text className="text-center font-semibold text-gray-900">
                Continue
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center">
              <Text className="text-gray-700">Don’t have an account? </Text>
              <Link href="./sign-up">
                <Text className="font-semibold text-gray-900">Sign up</Text>
              </Link>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}
