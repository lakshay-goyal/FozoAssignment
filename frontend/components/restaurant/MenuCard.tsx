import { View, Text, Image, TouchableOpacity } from 'react-native'
import type { MenuItem } from '../../types'
import { ShoppingCart } from 'lucide-react-native'

interface MenuCardProps {
  menuItem: MenuItem
  onPress?: () => void
}

export const MenuCard = ({ menuItem, onPress }: MenuCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-4"
    >
      {/* IMAGE */}
      <View className="h-40 bg-gray-200">
        {menuItem.imageUrl ? (
          <Image
            source={{ uri: menuItem.imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full justify-center items-center bg-gray-100">
            <Text className="font-sans text-gray-400 text-sm">No Image</Text>
          </View>
        )}
      </View>

      {/* CONTENT */}
      <View className="p-4">
        <View className="flex-row items-center mb-1">
          <View
            className="w-4 h-4 mr-2 border-2 items-center justify-center"
            style={{
              borderColor: menuItem.isVeg ? '#16A34A' : '#7C2D12',
            }}
          >
            <View
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: menuItem.isVeg ? '#22C55E' : '#B91C1C',
              }}
            />
          </View>

          <Text className="font-sans text-lg font-bold text-black flex-1" numberOfLines={1}>
            {menuItem.item_name}
          </Text>
        </View>


        {/* DESCRIPTION */}
        {menuItem.description && (
          <Text
            className="font-sans text-sm text-gray-600 mb-3"
            numberOfLines={2}
          >
            {menuItem.description}
          </Text>
        )}

        {/* PRICE AND ADD TO CART */}
        <View className="flex-row items-center justify-between mt-auto gap-1">
          <Text className="font-sans text-sm font-semibold text-[#F97316]">
            ₹{menuItem.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}