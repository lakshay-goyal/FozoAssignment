import { TouchableOpacity, View, Text } from 'react-native'
import type { RestaurantWithDistance } from '../../types/restaurant.types'

interface RestaurantCardProps {
  restaurant: RestaurantWithDistance
  onPress: () => void
}

export const RestaurantCard = ({ restaurant, onPress }: RestaurantCardProps) => {
  const visibleTags = restaurant.tags?.slice(0, 3) || []
  const remainingTags = restaurant.tags && restaurant.tags.length > 3 ? restaurant.tags.length - 3 : 0

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 mb-4 border border-gray-200 shadow-sm"
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-xl font-bold text-[#C83A1A] flex-1 mr-2">
          {restaurant.name}
        </Text>
        <View className="bg-[#D6EE72] rounded-lg px-3 py-1">
          <Text className="text-sm font-semibold text-black">
            {restaurant.distance} km
          </Text>
        </View>
      </View>
      
      {restaurant.description && (
        <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
          {restaurant.description}
        </Text>
      )}

      {restaurant.tags && restaurant.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {visibleTags.map((tag, index) => (
            <View key={index} className="bg-gray-100 rounded-full px-3 py-1">
              <Text className="text-gray-700 text-xs">{tag}</Text>
            </View>
          ))}
          {remainingTags > 0 && (
            <View className="bg-gray-100 rounded-full px-3 py-1">
              <Text className="text-gray-700 text-xs">+{remainingTags} more</Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  )
}

