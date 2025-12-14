import { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert, FlatList } from 'react-native'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Heart, ArrowLeft, Truck, Clock } from 'lucide-react-native'
import { wishlistService, type WishlistItem } from '../../services'
import { fontFamily } from '../../fonts'
import { PageLoading } from '../../components/ui'

export default function WishlistPage() {
  const { user } = useUser()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchWishlist = async () => {
    if (!user?.username) return

    try {
      setLoading(true)
      const items = await wishlistService.getWishlist(user.username)
      setWishlistItems(items)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      Alert.alert('Error', 'Failed to load wishlist')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWishlist()
  }, [user?.username])

  const onRefresh = () => {
    setRefreshing(true)
    fetchWishlist()
  }

  const handleRemoveFromWishlist = async (restaurantId: number) => {
    if (!user?.username) return

    try {
      await wishlistService.removeFromWishlist(user.username, restaurantId)
      await fetchWishlist()
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      Alert.alert('Error', 'Failed to remove restaurant from wishlist')
    }
  }

  const handleRestaurantPress = (restaurantId: number) => {
    router.push(`/(home)/restaurant/${restaurantId}`)
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
          Wishlist
        </Text>
      </View>

      {wishlistItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Heart size={64} color="#D3D1D8" />
          <Text
            style={{
              fontFamily: fontFamily.medium,
              fontSize: 18,
            }}
            className="text-gray-500 mb-2 mt-4"
          >
            Your wishlist is empty
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: 14,
            }}
            className="text-gray-400 text-center"
          >
            Tap the heart icon on restaurants to add them to your wishlist
          </Text>
        </View>
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleRestaurantPress(item.restaurant.id)}
              activeOpacity={0.85}
              className="bg-white rounded-[15px] overflow-hidden mx-4 my-2"
              style={{
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
                  source={{ uri: item.restaurant.imageUrl || 'https://via.placeholder.com/266x136' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation()
                    handleRemoveFromWishlist(item.restaurant.id)
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  <Heart size={16} color="#FF6B57" fill="#FF6B57" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View className="p-3">
                <Text
                  style={{
                    fontFamily: fontFamily.semiBold,
                    fontSize: 15,
                    lineHeight: 22,
                  }}
                  className="text-[#242731] mb-2"
                  numberOfLines={1}
                >
                  {item.restaurant.name}
                </Text>
                {item.restaurant.description && (
                  <Text
                    style={{
                      fontFamily: fontFamily.regular,
                      fontSize: 12,
                      lineHeight: 16,
                    }}
                    className="text-[#7E8392] mb-2"
                    numberOfLines={2}
                  >
                    {item.restaurant.description}
                  </Text>
                )}
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
                      {item.restaurant.distance ? `${item.restaurant.distance} km` : 'Free delivery'}
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
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6B57" />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}
    </View>
  )
}

