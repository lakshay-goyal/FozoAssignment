import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { View } from 'react-native'
import { customFonts } from '../fonts'
import { AddressProvider } from '../contexts/AddressContext'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing CLERK_PUBLISHABLE_KEY')
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(customFonts)

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <AddressProvider>
        <View style={{ flex: 1 }}>
          <Slot />
        </View>
      </AddressProvider>
    </ClerkProvider>
  )
}