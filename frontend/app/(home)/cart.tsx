import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Plus, Minus, Trash2, ArrowLeft } from 'lucide-react-native'
import { cartService, type CartItem } from '../../services'
import { fontFamily } from '../../fonts'
import { PageLoading } from '../../components/ui'

export default function CartPage() {
  const { user } = useUser()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchCart = async () => {
    if (!user?.username) return

    try {
      setLoading(true)
      const items = await cartService.getCart(user.username)
      setCartItems(items)
    } catch (error) {
      console.error('Error fetching cart:', error)
      Alert.alert('Error', 'Failed to load cart items')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [user?.username])

  const onRefresh = () => {
    setRefreshing(true)
    fetchCart()
  }

  const handleUpdateQuantity = async (cartId: number, newQuantity: number) => {
    if (!user?.username) return

    try {
      await cartService.updateCart(user.username, cartId, newQuantity)
      await fetchCart()
    } catch (error) {
      console.error('Error updating cart:', error)
      Alert.alert('Error', 'Failed to update quantity')
    }
  }

  const handleRemoveItem = async (cartId: number) => {
    if (!user?.username) return

    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await cartService.removeFromCart(user.username!, cartId)
              await fetchCart()
            } catch (error) {
              console.error('Error removing item:', error)
              Alert.alert('Error', 'Failed to remove item')
            }
          },
        },
      ]
    )
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.menu.price * item.quantity
    }, 0)
  }

  if (loading) {
    return <PageLoading />
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#242731" />
        </TouchableOpacity>
        <Text
          style={{
            fontFamily: fontFamily.bold,
            fontSize: 24,
          }}
          className="text-[#242731]"
        >
          Cart
        </Text>
      </View>

      {cartItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Text
            style={{
              fontFamily: fontFamily.medium,
              fontSize: 18,
            }}
            className="text-gray-500 mb-2"
          >
            Your cart is empty
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: 14,
            }}
            className="text-gray-400 text-center"
          >
            Add items to your cart to see them here
          </Text>
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B57" />}
          >
            {cartItems.map((item) => (
              <View
                key={item.id}
                className="flex-row p-4 border-b border-gray-100 bg-white"
              >
                {/* Image */}
                <View className="w-20 h-20 rounded-xl overflow-hidden mr-4">
                  {item.menu.imageUrl ? (
                    <Image
                      source={{ uri: item.menu.imageUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full bg-gray-200 items-center justify-center">
                      <Text className="text-gray-400 text-xs">No Image</Text>
                    </View>
                  )}
                </View>

                {/* Content */}
                <View className="flex-1">
                  <Text
                    style={{
                      fontFamily: fontFamily.semiBold,
                      fontSize: 16,
                    }}
                    className="text-[#242731] mb-1"
                    numberOfLines={1}
                  >
                    {item.menu.item_name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: 12,
                    }}
                    className="text-gray-500 mb-2"
                  >
                    {item.menu.restaurant.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: fontFamily.semiBold,
                      fontSize: 16,
                    }}
                    className="text-[#FF6B57] mb-3"
                  >
                    ₹{(item.menu.price * item.quantity).toFixed(2)}
                  </Text>

                  {/* Quantity Controls */}
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={() => {
                        if (item.quantity > 1) {
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      }}
                      className="w-8 h-8 rounded-full items-center justify-center bg-gray-100"
                    >
                      <Minus size={16} color="#242731" />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: fontFamily.semiBold,
                        fontSize: 16,
                      }}
                      className="text-[#242731] mx-4"
                    >
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full items-center justify-center bg-gray-100"
                    >
                      <Plus size={16} color="#242731" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item.id)}
                      className="ml-auto p-2"
                    >
                      <Trash2 size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Bottom Total Bar */}
          <View className="px-4 py-4 border-t border-gray-200 bg-white">
            <View className="flex-row justify-between items-center mb-4">
              <Text
                style={{
                  fontFamily: fontFamily.semiBold,
                  fontSize: 18,
                }}
                className="text-[#242731]"
              >
                Total
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                  fontSize: 24,
                }}
                className="text-[#FF6B57]"
              >
                ₹{calculateTotal().toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              className="w-full py-4 rounded-2xl items-center justify-center"
              style={{ backgroundColor: '#FF6B57' }}
            >
              <Text
                style={{
                  fontFamily: fontFamily.semiBold,
                  fontSize: 16,
                }}
                className="text-white"
              >
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

