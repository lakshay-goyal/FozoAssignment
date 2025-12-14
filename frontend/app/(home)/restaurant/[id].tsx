import { useState, useEffect } from 'react'
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as Location from 'expo-location'
import { RestaurantDetail, RestaurantDetailBottomSheet } from '../../../components/restaurant'
import { LocationSelectorModal } from '../../../components/ui'
import { useRestaurant, useUserLocation } from '../hooks'
import { LoadingState, ErrorState } from '../components'
import { userService, type Address } from '../../../services'
import { useAddress } from '../../../contexts/AddressContext'
import type { MenuItem } from '../../../types'

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { user } = useUser()
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
    address: string
  } | undefined>(undefined)

  const { restaurant, loading, error, fetchRestaurant } = useRestaurant(id, user?.username || undefined)
  const { address } = useUserLocation(user?.username || undefined)
  const { setSelectedAddress } = useAddress()

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      if (!user?.username) return

      try {
        const userData = await userService.getUserByUsername(user.username)
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: userData.latitude,
          longitude: userData.longitude,
        })

        const addressString = reverseGeocode[0]
          ? `${reverseGeocode[0].street || ''} ${reverseGeocode[0].city || ''} ${reverseGeocode[0].region || ''}`.trim()
          : address

        setCurrentLocation({
          latitude: userData.latitude,
          longitude: userData.longitude,
          address: addressString,
        })
      } catch (error) {
        console.error('Error fetching current location:', error)
      }
    }

    fetchCurrentLocation()
  }, [user?.username, address])

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

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address)
    // Refetch restaurant with new coordinates
    fetchRestaurant()
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

      <LocationSelectorModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onSelectAddress={handleSelectAddress}
        currentLocation={currentLocation}
      />
    </GestureHandlerRootView>
  )
}