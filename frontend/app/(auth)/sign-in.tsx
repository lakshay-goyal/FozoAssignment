import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
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

  const onSignInPress = async () => {
    if (!isLoaded) return

    setError('')

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        setError('Sign-in process is incomplete. Please check your email for further steps.')
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err)
      setError(errorMessage)
    }
  }

  return (
    <View className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-6">Sign in</Text>

      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <Text className="text-red-600 text-sm">{error}</Text>
        </View>
      ) : null}

      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => {
          setEmailAddress(emailAddress)
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
        onPress={onSignInPress}
        className="bg-blue-500 rounded-lg p-3 mb-4"
      >
        <Text className="text-white text-center font-semibold">Continue</Text>
      </TouchableOpacity>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        <Text>Don't have an account? </Text>
        <Link href="./sign-up">
          <Text className="text-blue-500">Sign up</Text>
        </Link>
      </View>
    </View>
  )
}
