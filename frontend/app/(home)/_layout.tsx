import { Stack } from 'expo-router/stack'
import { useAuth } from '@clerk/clerk-expo'
import { Redirect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useEffect, useRef } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Drawer } from 'react-native-drawer-layout'
import { DrawerContent } from '../../components/common'
import { DrawerProvider, useDrawer } from '../../contexts/DrawerContext'

function DrawerLayout() {
  const { isOpen, closeDrawer } = useDrawer()
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    setDrawerOpen(isOpen)
  }, [isOpen])

  return (
    <Drawer
      open={drawerOpen}
      onOpen={() => {
        setDrawerOpen(true)
      }}
      onClose={() => {
        setDrawerOpen(false)
        closeDrawer()
      }}
      renderDrawerContent={() => <DrawerContent onClose={closeDrawer} />}
      drawerType="slide"
    >
      <Stack
        screenOptions={{ headerShown: false }}
        screenListeners={{
          focus: () => {
            setDrawerOpen(false)
            closeDrawer()
          },
        }}
      />
    </Drawer>
  )
}

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-white">
        <DrawerProvider>
          <DrawerLayout />
        </DrawerProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}