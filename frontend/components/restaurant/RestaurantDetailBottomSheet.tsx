import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native'
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Truck, Clock, Star, Plus, Minus } from 'lucide-react-native'
import type { RestaurantWithDistance, MenuItem } from '../../types'
import { fontFamily } from '../../fonts'
import { useUser } from '@clerk/clerk-expo'
import { cartService } from '../../services'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface RestaurantDetailBottomSheetProps {
  restaurant: RestaurantWithDistance | null
  menuItem: MenuItem | null
  onClose: () => void
}

export const RestaurantDetailBottomSheet: React.FC<RestaurantDetailBottomSheetProps> = ({
  restaurant,
  menuItem,
  onClose,
}) => {
  const { user } = useUser()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)

  const snapPoints = useMemo(() => ['90%'], [])

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose()
    }
  }, [onClose])

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const calculateTotalPrice = () => {
    if (!menuItem) return 0
    const basePrice = menuItem.price
    return (basePrice) * quantity
  }

  const handleAddToCart = async () => {
    if (!user?.username || !menuItem) return

    try {
      setAddingToCart(true)
      await cartService.addToCart(user.username, menuItem.id, quantity)
      Alert.alert('Success', 'Item added to cart!', [
        { text: 'OK', onPress: () => bottomSheetRef.current?.close() },
      ])
    } catch (error: any) {
      console.error('Error adding to cart:', error)
      Alert.alert('Error', error.message || 'Failed to add item to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
      />
    ),
    []
  )

  if (!restaurant || !menuItem) {
    return null
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#FFFFFF', borderRadius:12 }}
      handleIndicatorStyle={{ backgroundColor: '#D3D1D8', width: 40 }}
      backdropComponent={renderBackdrop}
    >
      <View style={{ flex: 1 }}>
        <BottomSheetScrollView
          contentContainerStyle={{ paddingBottom: 90 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Image Section */}
          <View className="relative" style={{ width: SCREEN_WIDTH, height: 252, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={{
                uri: menuItem.imageUrl || restaurant.imageUrl || 'https://via.placeholder.com/375x252',
              }}
              style={{ width: '90%', height: 252, borderRadius: 20, margin: 'auto', marginTop: 10, marginBottom: 20 }}
              resizeMode="cover"
            />
          </View>

          {/* Content Section */}
          <View className="px-6 pt-4">
            {/* Header with Name and Price */}
            <View className="flex-row justify-between items-start mb-3">
              <View className="flex-1 pr-4">
                <Text
                  style={{
                    fontFamily: fontFamily.bold,
                    fontSize: 26,
                    lineHeight: 30,
                    letterSpacing: -0.02,
                  }}
                  className="text-[#242731] mb-2"
                >
                  {menuItem.item_name}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: fontFamily.semiBold,
                  fontSize: 24,
                  lineHeight: 36,
                }}
                className="text-[#FF6B57]"
              >
                ₹{menuItem.price.toFixed(2)}
              </Text>
            </View>

            {/* Delivery Info and Rating */}
            <View className="flex-row items-center mb-3">
              <View className="flex-row items-center mr-4">
                <Truck size={14} color="#FF6B57" />
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: 12,
                    lineHeight: 14,
                  }}
                  className="text-[#7E8392] ml-1"
                >
                  Free delivery
                </Text>
              </View>
              <View className="flex-row items-center mr-4">
                <Clock size={14} color="#FF6B57" />
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: 12,
                    lineHeight: 14,
                  }}
                  className="text-[#7E8392] ml-1"
                >
                  45 mins
                </Text>
              </View>
              <View className="flex-row items-center">
                <Star size={12} color="#FFCB40" fill="#FFCB40" />
                <Text
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: 12,
                    lineHeight: 18,
                    textDecorationLine: 'underline',
                  }}
                  className="text-[#111719] ml-1"
                >
                  4.5
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: 14,
                lineHeight: 22,
              }}
              className="text-[#646982] mb-6"
            >
              {menuItem.description ||
                'Succulent butter and garlic infused shrimp sizzling in a flavorful cream sauce, tossed with perfectly cooked pasta.'}
            </Text>
          </View>

          {/* Bottom Action Bar */}
          <View
            className="px-6 py-4 flex-row items-center justify-between"
            style={{
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              height: 74,
              shadowColor: '#3F4C5F',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
              elevation: 10,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <View className="flex-row items-center" style={{ width: 89 }}>
              <TouchableOpacity
                onPress={handleDecreaseQuantity}
                className="w-[22px] h-[22px] rounded-full items-center justify-center"
                style={{ backgroundColor: '#D3D1D8' }}
              >
                <Minus size={12} color="#201C1F" strokeWidth={2} />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                  fontSize: 14,
                  lineHeight: 21,
                  textTransform: 'capitalize',
                }}
                className="text-black mx-4"
              >
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={handleIncreaseQuantity}
                className="w-[22px] h-[22px] rounded-full items-center justify-center"
                style={{ backgroundColor: '#D3D1D8' }}
              >
                <Plus size={12} color="#201C1F" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleAddToCart}
              disabled={addingToCart}
              className="px-6 py-3 rounded-[28.5px] flex-row items-center"
              style={{
                backgroundColor: addingToCart ? '#999' : '#FF6B57',
                shadowColor: '#FE724C',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                shadowRadius: 30,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.medium,
                  fontSize: 14,
                  lineHeight: 21,
                  fontVariant: ['small-caps'],
                }}
                className="text-white mr-2"
              >
                {addingToCart ? 'Adding...' : `Add ${quantity} to basket`}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.medium,
                  fontSize: 14,
                  lineHeight: 21,
                  fontVariant: ['small-caps'],
                }}
                className="text-white"
              >
                ₹{calculateTotalPrice().toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  )
}

