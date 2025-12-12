import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing CLERK_PUBLISHABLE_KEY')
}

export default function RootLayout() {
  return <ClerkProvider tokenCache={tokenCache}>
    <Slot />
  </ClerkProvider>
}