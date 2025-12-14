import React, { useState, useMemo } from 'react'
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

type FilterType = 'all' | 'veg' | 'non-veg'

export const RestaurantDetail = ({
  restaurant,
  onBackPress,
  onMenuItemPress,
}: RestaurantDetailProps) => {
  const { user } = useUser()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')

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

  // Filter menu items based on selected filter
  const filteredMenu = useMemo(() => {
    if (!restaurant.menu) return []
    
    if (filter === 'all') {
      return restaurant.menu
    } else if (filter === 'veg') {
      return restaurant.menu.filter(item => item.isVeg)
    } else {
      return restaurant.menu.filter(item => !item.isVeg)
    }
  }, [restaurant.menu, filter])

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
        
        {/* FILTER BUTTONS */}
        <View className="flex-row gap-3 mb-4">
          <TouchableOpacity
            onPress={() => setFilter('all')}
            activeOpacity={0.7}
            className={`px-4 py-2 rounded-full border-2 ${
              filter === 'all'
                ? 'bg-[#F97316] border-[#F97316]'
                : 'bg-white border-gray-300'
            }`}
          >
            <Text
              className={`font-sans text-sm font-semibold ${
                filter === 'all' ? 'text-white' : 'text-gray-700'
              }`}
            >
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('veg')}
            activeOpacity={0.7}
            className={`px-4 py-2 rounded-full border-2 flex-row items-center gap-2 ${
              filter === 'veg'
                ? 'bg-[#16A34A] border-[#16A34A]'
                : 'bg-white border-gray-300'
            }`}
          >
            <View
              className="w-3 h-3 border-2 items-center justify-center"
              style={{
                borderColor: filter === 'veg' ? '#fff' : '#16A34A',
              }}
            >
              <View
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: filter === 'veg' ? '#fff' : '#22C55E',
                }}
              />
            </View>
            <Text
              className={`font-sans text-sm font-semibold ${
                filter === 'veg' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Veg
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFilter('non-veg')}
            activeOpacity={0.7}
            className={`px-4 py-2 rounded-full border-2 flex-row items-center gap-2 ${
              filter === 'non-veg'
                ? 'bg-[#7C2D12] border-[#7C2D12]'
                : 'bg-white border-gray-300'
            }`}
          >
            <View
              className="w-3 h-3 border-2 items-center justify-center"
              style={{
                borderColor: filter === 'non-veg' ? '#fff' : '#7C2D12',
              }}
            >
              <View
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: filter === 'non-veg' ? '#fff' : '#B91C1C',
                }}
              />
            </View>
            <Text
              className={`font-sans text-sm font-semibold ${
                filter === 'non-veg' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Non-Veg
            </Text>
          </TouchableOpacity>
        </View>

        {filteredMenu && filteredMenu.length > 0 ? (
          <FlatList
            data={filteredMenu}
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
            No menu items available for this filter
          </Text>
        )}
      </View>
    </View>
  )
}
