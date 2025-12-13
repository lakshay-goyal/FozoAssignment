import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native'
import { useRouter } from 'expo-router'
import { fontFamily } from '../../fonts'
import { RestaurantCard } from '../restaurant'
import type { RestaurantWithDistance } from '../../types'

const { width: screenWidth } = Dimensions.get('window')

interface RestaurantsSectionProps {
  restaurants: RestaurantWithDistance[]
  loading: boolean
  error: string | null
  searchQuery: string
  onRetry: () => void
}

export const RestaurantsSection = ({
  restaurants,
  loading,
  error,
  searchQuery,
  onRetry,
}: RestaurantsSectionProps) => {
  const router = useRouter()

  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (!searchQuery.trim()) {
      return true
    }

    const query = searchQuery.toLowerCase().trim()
    const nameMatch = restaurant.name.toLowerCase().includes(query)
    const descriptionMatch = restaurant.description?.toLowerCase().includes(query) || false
    const tagsMatch = restaurant.tags.some((tag) => tag.toLowerCase().includes(query))

    return nameMatch || descriptionMatch || tagsMatch
  })

  return (
    <View className="mb-24">
      <View className="flex-row justify-between items-center px-6 mb-4">
        <Text
          style={{ fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 27 }}
          className="text-[#32343E]"
        >
          Restaurants
        </Text>
        <Text
          style={{ fontFamily: fontFamily.medium, fontSize: 11, lineHeight: 16 }}
          className="text-[#FF6B57]"
        >
          View All
        </Text>
      </View>
      {loading ? (
        <View className="py-8 items-center">
          <ActivityIndicator size="large" color="#FF6B57" />
          <Text
            style={{ fontFamily: fontFamily.regular }}
            className="mt-3 text-gray-500"
          >
            Loading restaurants...
          </Text>
        </View>
      ) : error ? (
        <View className="py-8 items-center px-6">
          <Text
            style={{ fontFamily: fontFamily.regular }}
            className="text-red-500 text-center mb-4"
          >
            {error}
          </Text>
          <TouchableOpacity
            onPress={onRetry}
            className="bg-[#FF6B57] px-6 py-3 rounded-full"
          >
            <Text
              style={{ fontFamily: fontFamily.semiBold }}
              className="text-white"
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        >
          {filteredRestaurants.length === 0 && searchQuery ? (
            <View className="py-8 items-center" style={{ width: screenWidth - 48 }}>
              <Text
                style={{ fontFamily: fontFamily.regular }}
                className="text-gray-500 text-center"
              >
                No restaurants found matching "{searchQuery}"
              </Text>
            </View>
          ) : (
            filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() =>
                  router.push(`/(home)/restaurant/${restaurant.id}`)
                }
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  )
}

