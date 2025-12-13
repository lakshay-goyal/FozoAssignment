import { View, Text, TouchableOpacity } from 'react-native'
import type { RestaurantWithDistance } from '../../types/restaurant.types'

interface RestaurantDetailProps {
  restaurant: RestaurantWithDistance
  onBackPress: () => void
}

export const RestaurantDetail = ({ restaurant, onBackPress }: RestaurantDetailProps) => {
  return (
    <>
      <TouchableOpacity onPress={onBackPress} className="mb-6" activeOpacity={0.7}>
        <Text className="text-[#C83A1A] text-lg font-semibold">← Back</Text>
      </TouchableOpacity>

      <Text className="text-3xl font-bold text-[#C83A1A] mb-4">
        {restaurant.name}
      </Text>

      <View className="bg-[#D6EE72] rounded-xl p-4 mb-6">
        <Text className="text-lg font-semibold text-black">
          {restaurant.distance} km away
        </Text>
      </View>

      {restaurant.description && (
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-2">About</Text>
          <Text className="text-gray-700 text-base leading-6">
            {restaurant.description}
          </Text>
        </View>
      )}

      {restaurant.tags && restaurant.tags.length > 0 && (
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-3">Tags</Text>
          <View className="flex-row flex-wrap gap-2">
            {restaurant.tags.map((tag, index) => (
              <View
                key={index}
                className="bg-white rounded-full px-4 py-2 border border-gray-300"
              >
                <Text className="text-gray-700 text-sm">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="bg-white rounded-xl p-4 border border-gray-200">
        <Text className="text-xl font-semibold text-gray-800 mb-2">Location</Text>
        <Text className="text-gray-600 text-sm">
          Latitude: {restaurant.latitude.toFixed(6)}
        </Text>
        <Text className="text-gray-600 text-sm">
          Longitude: {restaurant.longitude.toFixed(6)}
        </Text>
      </View>
    </>
  )
}

