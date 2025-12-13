import { useEffect, useState } from 'react'
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { restaurantService } from '../../../services/restaurant.service'
import type { RestaurantWithDistance } from '../../../types/restaurant.types'
import { RestaurantDetail } from '../../../components/restaurant/RestaurantDetail'

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { user } = useUser()
  const [restaurant, setRestaurant] = useState<RestaurantWithDistance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!user?.username) {
        setError('User not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await restaurantService.getRestaurantById(id, user.username)
        setRestaurant(data)
      } catch (err: any) {
        setError(err.message || 'Something went wrong')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [id, user?.username])

  if (loading) {
    return (
      <View className="flex-1 bg-[#FFF0DA] items-center justify-center">
        <ActivityIndicator size="large" color="#C83A1A" />
        <Text className="mt-4 text-gray-600">Loading restaurant details...</Text>
      </View>
    )
  }

  if (error || !restaurant) {
    return (
      <View className="flex-1 bg-[#FFF0DA] items-center justify-center px-4">
        <Text className="text-red-500 text-lg mb-4 text-center">{error || 'Restaurant not found'}</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-[#C83A1A] rounded-xl py-3 px-6"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-[#FAFAFA]">
      <View className="p-6">
        <RestaurantDetail
          restaurant={restaurant}
          onBackPress={() => router.back()}
        />
      </View>
    </ScrollView>
  )
}