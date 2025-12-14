import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native"
import { Heart, ArrowLeft, Flame } from "lucide-react-native"
import { useUser } from '@clerk/clerk-expo'
import { useFocusEffect } from 'expo-router'
import type { RestaurantWithDistance, MenuItem } from "../../types"
import { MenuCard } from "./MenuCard"
import { wishlistService } from "../../services"

interface RestaurantDetailProps {
  restaurant: RestaurantWithDistance
  onBackPress: () => void
  onMenuItemPress?: (menuItem: MenuItem) => void
}

export const RestaurantDetail = ({
  restaurant,
  onBackPress,
  onMenuItemPress,
}: RestaurantDetailProps) => {
  const { user } = useUser()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)

  // Fetch wishlist status when component mounts or comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkWishlistStatus()
    }, [user?.username, restaurant.id])
  )

  const checkWishlistStatus = async () => {
    if (!user?.username) return

    try {
      const wishlist = await wishlistService.getWishlist(user.username)
      const isWishlisted = wishlist.some((item) => item.restaurantId === restaurant.id)
      setIsInWishlist(isWishlisted)
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const handleToggleWishlist = async () => {
    if (!user?.username || loading) return

    try {
      setLoading(true)
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(user.username, restaurant.id)
        setIsInWishlist(false)
      } else {
        await wishlistService.addToWishlist(user.username, restaurant.id)
        setIsInWishlist(true)
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error)
      Alert.alert('Error', error.message || 'Failed to update wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (menuItem: MenuItem) => {
    // If onMenuItemPress is provided, use it to open bottom sheet
    // Otherwise, use the old add to cart functionality
    if (onMenuItemPress) {
      onMenuItemPress(menuItem)
    } else {
      // TODO: Implement add to cart functionality
      console.log('Add to cart:', menuItem)
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-5 pt-4 mb-4">
        <TouchableOpacity onPress={onBackPress} activeOpacity={0.7}>
          <ArrowLeft size={24} color="#111" />
        </TouchableOpacity>

        <Text className="font-sans text-lg font-semibold text-black">Details</Text>

        <TouchableOpacity
          onPress={handleToggleWishlist}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Heart
            size={22}
            color={isInWishlist ? "#FF6B57" : "#111"}
            fill={isInWishlist ? "#FF6B57" : "none"}
          />
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
                  onPress={() => onMenuItemPress?.(item)}
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
