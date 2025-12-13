import { TouchableOpacity, View, Text, Image } from 'react-native'
import type { RestaurantWithDistance } from '../../types/restaurant.types'

interface RestaurantCardProps {
  restaurant: RestaurantWithDistance
  onPress: () => void
}

export const RestaurantCard = ({ restaurant, onPress }: RestaurantCardProps) => {
  const visibleTags = restaurant.tags?.slice(0, 2) || []

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="mb-6 bg-white rounded-2xl overflow-hidden shadow-sm"
    >
      <View className="h-44 bg-gray-200 justify-center items-center">
        <Image source={{ uri: restaurant.imageUrl || '' }} className="w-full h-full object-contain" />
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-start mb-1">
          <Text className="font-sans text-lg font-bold text-black flex-1 mr-2">
            {restaurant.name}
          </Text>
          <View className="bg-orange-100 px-3 py-1 rounded-full">
            <Text className="font-sans text-xs text-orange-600 font-semibold">
              {restaurant.distance} km
            </Text>
          </View>
        </View>

        {restaurant.description && (
          <Text
            className="font-sans text-sm text-gray-500 mb-3"
            numberOfLines={2}
          >
            {restaurant.description}
          </Text>
        )}

        <View className="flex-row gap-2">
          {visibleTags.map((tag, index) => (
            <View
              key={index}
              className="bg-gray-100 px-3 py-1 rounded-full"
            >
              <Text className="font-sans text-xs text-gray-700">{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )
}