import { Stack } from 'expo-router/stack'
import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/" />
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  )
}