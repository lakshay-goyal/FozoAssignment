import { useState } from 'react'
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { RestaurantDetail, RestaurantDetailBottomSheet } from '../../../components/restaurant'
import { useRestaurant } from '../hooks'
import { LoadingState, ErrorState } from '../components'
import type { MenuItem } from '../../../types'

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { user } = useUser()
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)

  const { restaurant, loading, error, fetchRestaurant } = useRestaurant(id, user?.username || undefined)

  if (loading) {
    return <LoadingState message="Loading restaurant details..." />
  }

  if (error || !restaurant) {
    return (
      <View className="flex-1 bg-[#FFF0DA] items-center justify-center px-4">
        <ErrorState
          message={error || 'Restaurant not found'}
          onRetry={fetchRestaurant}
          retryLabel="Retry"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#C83A1A] rounded-xl py-3 px-6 mt-4"
        >
          <Text className="font-sans text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleMenuItemPress = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem)
  }

  const handleCloseBottomSheet = () => {
    setSelectedMenuItem(null)
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-white">
        <View className="p-6">
          <RestaurantDetail
            restaurant={restaurant}
            onBackPress={() => router.back()}
            onMenuItemPress={handleMenuItemPress}
          />
        </View>
      </ScrollView>

      {selectedMenuItem && (
        <RestaurantDetailBottomSheet
          restaurant={restaurant}
          menuItem={selectedMenuItem}
          onClose={handleCloseBottomSheet}
        />
      )}
    </GestureHandlerRootView>
  )
}