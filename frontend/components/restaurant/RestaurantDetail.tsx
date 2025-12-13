import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native"
import { Heart, ArrowLeft, Flame } from "lucide-react-native"
import type { RestaurantWithDistance, MenuItem } from "../../types/restaurant.types"
import { MenuCard } from "./MenuCard"

interface RestaurantDetailProps {
  restaurant: RestaurantWithDistance
  onBackPress: () => void
}

export const RestaurantDetail = ({
  restaurant,
  onBackPress,
}: RestaurantDetailProps) => {
  const handleAddToCart = (menuItem: MenuItem) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', menuItem)
  }

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-5 pt-4 mb-4">
        <TouchableOpacity onPress={onBackPress} activeOpacity={0.7}>
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>

        <Text className="font-sans text-lg font-semibold text-black">Details</Text>

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
        <Text className="font-sans text-2xl font-bold text-black">
          {restaurant.name}
        </Text>

        <View className="flex-row items-center gap-1">
          <Flame size={16} color="#F97316" />
          <Text className="font-sans text-sm font-medium text-gray-700">
            {restaurant.tags.join(', ')}
          </Text>
        </View>
      </View>

      {/* DELIVERY INFO */}
      <View className="px-5 mb-4">
        <Text className="font-sans text-[#F97316] font-semibold">
          {restaurant.distance} km away from you
        </Text>
      </View>

      {/* DESCRIPTION */}
      <View className="px-5 mb-6">
        <Text className="font-sans text-gray-700 leading-6">
          {restaurant.description}
        </Text>
      </View>

      {/* MENU */}
      <View className="px-5 mb-6">
        <Text className="font-sans text-xl font-bold text-black mb-4">
          Menu
        </Text>
        {restaurant.menu && restaurant.menu.length > 0 ? (
          <FlatList
            data={restaurant.menu}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View style={{ width: '48%' }}>
                <MenuCard
                  menuItem={item}
                  onAddToCart={handleAddToCart}
                />
              </View>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
            ListEmptyComponent={
              <Text className="font-sans text-gray-500 text-center py-4">
                No menu items available
              </Text>
            }
          />
        ) : (
          <Text className="font-sans text-gray-500 text-center py-4">
            No menu items available
          </Text>
        )}
      </View>
    </View>
  )
}
