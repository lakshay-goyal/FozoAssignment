import { TouchableOpacity, View, Text, Image } from 'react-native'
import { Heart, Truck, Clock } from 'lucide-react-native'
import type { RestaurantWithDistance } from '../../types'
import { fontFamily } from '../../fonts'

interface RestaurantCardProps {
  restaurant: RestaurantWithDistance
  onPress: () => void
}

export const RestaurantCard = ({ restaurant, onPress }: RestaurantCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-white rounded-[15px] overflow-hidden"
      style={{
        width: 266,
        height: 203,
        shadowColor: '#D3D1D8',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 30,
        elevation: 5,
      }}
    >
      {/* Image with Heart Icon */}
      <View className="relative" style={{ height: 136 }}>
        <Image
          source={{ uri: restaurant.imageUrl || 'https://via.placeholder.com/266x136' }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            shadowColor: '#FE724C',
            shadowOffset: { width: 0, height: 7 },
            shadowOpacity: 0.4,
            shadowRadius: 15,
            elevation: 5,
          }}
        >
          <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="p-3 flex-1 justify-between">
        {/* Header with Name and Rating */}
        <View className="flex-row justify-between items-center mb-1">
          <Text
            style={{
              fontFamily: fontFamily.semiBold,
              fontSize: 15,
              lineHeight: 22,
            }}
            className="text-[#242731] flex-1"
            numberOfLines={1}
          >
            {restaurant.name}
          </Text>
          <View className="flex-row items-center gap-1">
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 10,
                lineHeight: 12,
              }}
              className="text-[#242731]"
            >
              ⭐
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 10,
                lineHeight: 12,
              }}
              className="text-[#242731]"
            >
              4.5
            </Text>
          </View>
        </View>

        {/* Delivery Info */}
        <View className="flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Truck size={14} color="#FF6B57" />
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 12,
                lineHeight: 14,
              }}
              className="text-[#7E8392]"
            >
              {restaurant.distance} km
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Clock size={14} color="#FF6B57" />
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 12,
                lineHeight: 14,
              }}
              className="text-[#7E8392]"
            >
              45 mins
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}