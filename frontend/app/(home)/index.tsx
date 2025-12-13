import { useEffect, useState } from 'react'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { SignOutButton } from '../../components/SignOutButton'
import { RestaurantCard } from '../../components/restaurant/RestaurantCard'
import { restaurantService } from '../../services/restaurant.service'
import type { RestaurantWithDistance } from '../../types/restaurant.types'

export default function Page() {
  const { user } = useUser()
  const router = useRouter()
  const [restaurants, setRestaurants] = useState<RestaurantWithDistance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchRestaurants = async () => {
    if (!user?.username) {
      setError('User not found')
      setLoading(false)
      return
    }

    try {
      const data = await restaurantService.getRestaurants(user.username)
      setRestaurants(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (user?.username) {
      fetchRestaurants()
    }
  }, [user?.username])

  const onRefresh = () => {
    setRefreshing(true)
    fetchRestaurants()
  }

  return (
    <View className="flex-1 bg-[#FFF0DA]">
      <SignedIn>
        <View className="flex-1">
          {/* Header */}
          <View className="px-6 pt-4 pb-2 flex-row justify-between items-center">
            <Text className="text-2xl font-bold text-[#C83A1A]">
              Restaurants
            </Text>
            <SignOutButton />
          </View>

          {/* Content */}
          {loading && !refreshing ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#C83A1A" />
              <Text className="mt-4 text-gray-600">Loading restaurants...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center px-4">
              <Text className="text-red-500 text-lg mb-4 text-center">{error}</Text>
              <TouchableOpacity
                onPress={fetchRestaurants}
                className="bg-[#C83A1A] rounded-xl py-3 px-6"
              >
                <Text className="text-white font-semibold">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : restaurants.length === 0 ? (
            <View className="flex-1 items-center justify-center px-4">
              <Text className="text-gray-600 text-lg text-center">No restaurants found</Text>
            </View>
          ) : (
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ padding: 24, paddingTop: 12 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C83A1A" />
              }
            >
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onPress={() => router.push(`/(home)/restaurant/${restaurant.id}`)}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </SignedIn>
      <SignedOut>
        <View className="flex-1 items-center justify-center">
          <Link href="../sign-in">
            <Text className="text-[#C83A1A] text-lg font-semibold">Sign in</Text>
          </Link>
        </View>
      </SignedOut>
    </View>
  )
}