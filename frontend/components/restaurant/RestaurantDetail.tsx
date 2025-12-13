import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native"
import { Heart, ArrowLeft, Flame } from "lucide-react-native"
import type { RestaurantWithDistance } from "../../types/restaurant.types"

interface RestaurantDetailProps {
  restaurant: RestaurantWithDistance
  onBackPress: () => void
}

export const RestaurantDetail = ({
  restaurant,
  onBackPress,
}: RestaurantDetailProps) => {
  return (
    <View className="flex-1 bg-[#FAFAFA]">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-5 pt-4 mb-4">
        <TouchableOpacity onPress={onBackPress} activeOpacity={0.7}>
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-black">Details</Text>

        <TouchableOpacity activeOpacity={0.7}>
          <Heart size={22} color="#111" />
        </TouchableOpacity>
      </View>

      {/* IMAGE */}
      <View className="px-5 mb-5">
        <Image
          source={{ uri: restaurant.imageUrl || '' }}
          className="w-full h-56 rounded-2xl"
          resizeMode="cover"
        />
      </View>

      {/* TITLE + CALORIES */}
      <View className="px-5 flex-row items-center justify-between mb-2">
        <Text className="text-2xl font-bold text-black">
          {restaurant.name}
        </Text>

        <View className="flex-row items-center gap-1">
          <Flame size={16} color="#F97316" />
          <Text className="text-sm font-medium text-gray-700">
            {restaurant.tags.join(', ')}
          </Text>
        </View>
      </View>

      {/* DELIVERY INFO */}
      <View className="px-5 mb-4">
        <Text className="text-[#F97316] font-semibold">
          {restaurant.distance} km away from you
        </Text>
      </View>

      {/* DESCRIPTION */}
      <View className="px-5 mb-6">
        <Text className="text-gray-700 leading-6">
          {restaurant.description}
        </Text>
      </View>

      {/* TAGS */}
      <View className="px-5 mb-6">
        <Text className="text-lg font-semibold mb-4">
          Tags
        </Text>

        {restaurant.tags?.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            className="flex-row items-center justify-between mb-4"
          >
            <View className="flex-row items-center gap-3">
              <View
                className={`w-5 h-5 rounded-full border ${
                  item
                    ? "bg-[#F97316] border-[#F97316]"
                    : "border-gray-400"
                }`} />
              <Text className="text-base text-black">{item.toUpperCase()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ADD TO CART */}
      <View className="px-5 pb-6">
        <View className="flex-row items-center bg-[#F97316] rounded-2xl overflow-hidden">
          <TouchableOpacity
            className="flex-1 py-4"
            activeOpacity={0.8}
          >
            <Text className="text-center text-white font-semibold text-lg">
              Add to Cart
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center bg-[#E86512] px-4 py-2 rounded-xl mr-2">
            <TouchableOpacity>
              <Text className="text-white text-lg font-bold px-2">−</Text>
            </TouchableOpacity>

            <Text className="text-white font-semibold mx-2">1</Text>

            <TouchableOpacity>
              <Text className="text-white text-lg font-bold px-2">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}
