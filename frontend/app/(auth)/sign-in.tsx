import React, { useState } from 'react'
import { Text, View } from 'react-native'
import { Link, useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'
import { BurgerBackground } from '@/components/BurgerBackground'
import { DraggableCard } from '@/components/DraggableCard'
import { InputFeild } from '@/components/InputFeild'
import { Button } from '@/components/Button'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)

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

  return (
    <View className="flex-1 bg-[#D6EE72]">
      {/* Background */}
      <View className="flex-1">
        <BurgerBackground />
      </View>

      {/* Sign-In-Form */}
      <DraggableCard title="Sign in to continue" onDragStateChange={setIsDragging}>
        {error ? (
          <View className="bg-red-100 border border-red-300 rounded-xl p-3 mb-4 w-full">
            <Text className="font-sans text-red-700 text-sm">{error}</Text>
          </View>
        ) : null}

        <InputFeild
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(t: string) => {
            setEmailAddress(t)
            setError('')
          }}
          secureTextEntry={false}
        />

        <InputFeild
          value={password}
          placeholder="Enter password"
          onChangeText={(t: string) => {
            setPassword(t)
            setError('')
          }}
          secureTextEntry={true}
        />

        <Button title="Sign in" onPress={onSignInPress} />

        <View className="flex-row justify-center">
          <Text className="font-sans text-gray-700">Don't have an account? </Text>
          <Link href="./sign-up">
            <Text className="font-sans font-bold text-gray-900">Sign up</Text>
          </Link>
        </View>
      </DraggableCard>
    </View>
  )
}