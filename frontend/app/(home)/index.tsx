import { useEffect, useRef, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Dimensions,
} from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as Location from 'expo-location'
import { SignOutButton } from '../../components/SignOutButton'
import { RestaurantCard } from '../../components/restaurant/RestaurantCard'
import { restaurantService } from '../../services/restaurant.service'
import { userService } from '../../services/user.service'
import type { RestaurantWithDistance } from '../../types/restaurant.types'
import { fontFamily } from '../../fonts'

const { width: screenWidth } = Dimensions.get('window')

export default function Page() {
  const { user } = useUser()
  const router = useRouter()

  const [restaurants, setRestaurants] = useState<RestaurantWithDistance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userAddress, setUserAddress] = useState<string>('Loading...')

  const scrollRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const fetchRestaurants = async () => {
    if (!user?.username) {
      setError('User not found')
      setLoading(false)
      return
    }

    try {
      const data = await restaurantService.getRestaurants(user.username)
      setRestaurants(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchUserLocation = async () => {
    if (!user?.username) return

    try {
      const userData = await userService.getUserByUsername(user.username)
      
      // Reverse geocode coordinates to get address
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: userData.latitude,
        longitude: userData.longitude,
      })

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0]
        // Format address: street, city, region, country
        const addressParts = [
          address.street,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean)
        
        const formattedAddress = addressParts.length > 0 
          ? addressParts.join(', ')
          : `${address.streetNumber || ''} ${address.street || ''}`.trim() || 
            `${address.city || ''}, ${address.region || ''}`.trim() ||
            'Location not available'
        
        setUserAddress(formattedAddress)
      } else {
        setUserAddress('Location not available')
      }
    } catch (err: any) {
      console.error('Failed to fetch user location:', err)
      setUserAddress('Location not available')
    }
  }

  useEffect(() => {
    if (user?.username) {
      fetchRestaurants()
      fetchUserLocation()
    }
  }, [user?.username])

  const onRefresh = () => {
    setRefreshing(true)
    fetchRestaurants()
  }

  // Promo banners array
  const promoBanners = [
    { id: 1, code: 'FIRST40', title: 'Get 40% off\nYour First Order!' },
    { id: 2, code: 'SUMMER20', title: 'Enjoy 20% off\nSummer Special!' },
    { id: 3, code: 'FREESHIP', title: 'Free Shipping\nOn Orders Above $50!' },
  ]

  // Filter restaurants based on search query
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (!searchQuery.trim()) {
      return true
    }

    const query = searchQuery.toLowerCase().trim()
    const nameMatch = restaurant.name.toLowerCase().includes(query)
    const descriptionMatch = restaurant.description?.toLowerCase().includes(query) || false
    const tagsMatch = restaurant.tags.some((tag) => tag.toLowerCase().includes(query))

    return nameMatch || descriptionMatch || tagsMatch
  })

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % promoBanners.length
      setCurrentIndex(nextIndex)
      scrollRef.current?.scrollTo({ x: nextIndex * screenWidth, animated: true })
    }, 3000)

    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      <SignedIn>
        {/* HEADER */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 mr-3">
              <Text className="font-sans text-xs text-gray-500">Your location</Text>
              <Text className="font-sans text-base font-semibold text-black" numberOfLines={1} ellipsizeMode="tail">
                {userAddress} ▼
              </Text>
            </View>
            <View className="flex-shrink-0">
              <SignOutButton/>
            </View>
          </View>
          <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-sm">
            <Text className="font-sans text-gray-400 mr-2">🔍</Text>
            <TextInput
              placeholder="Type to search"
              placeholderTextColor="#9CA3AF"
              style={{ fontFamily: fontFamily.regular }}
              className="flex-1 text-sm text-black"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View className="bg-orange-100 px-3 py-1 rounded-full">
              <Text className="font-sans text-xs text-orange-500 font-semibold">
                Now
              </Text>
            </View>
          </View>
        </View>

        {/* PROMO BANNERS */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {promoBanners.map((banner, index) => {
            const colors = ['#F05A28', '#4CAF50', '#1E88E5']
            const bgColor = colors[index % colors.length]

            return (
              <View
                key={banner.id}
                style={{
                  width: screenWidth - 32,
                  height: 300,
                  marginHorizontal: 16,
                  backgroundColor: bgColor,
                  borderRadius: 24,
                  paddingVertical: 24,
                  paddingHorizontal: 20,
                }}
              >
                <Text className="font-sans text-white text-xs mb-2">
                  Use code <Text className="font-sans font-bold">{banner.code}</Text> at checkout
                </Text>
                <Text className="font-sans text-white text-2xl font-bold mb-6">
                  {banner.title}
                </Text>
                <TouchableOpacity className="bg-black self-start px-5 py-2 rounded-full">
                  <Text className="font-sans text-white font-semibold text-sm">Order Now</Text>
                </TouchableOpacity>
              </View>
            )
          })}
        </ScrollView>


        {/* RESTAURANT LIST */}
        {loading && !refreshing ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#F05A28" />
            <Text className="font-sans mt-3 text-gray-500">Loading restaurants...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-6">
            <Text className="font-sans text-red-500 text-center mb-4">{error}</Text>
            <TouchableOpacity
              onPress={fetchRestaurants}
              className="bg-[#F05A28] px-6 py-3 rounded-full"
            >
              <Text className="font-sans text-white font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 120 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#F05A28"
              />
            }
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="font-sans text-lg font-bold text-black">
                {searchQuery ? `Search Results (${filteredRestaurants.length})` : 'Popular Food'}
              </Text>
              {!searchQuery && (
                <Text className="font-sans text-sm text-orange-500 font-semibold">See All</Text>
              )}
            </View>

            {filteredRestaurants.length === 0 && searchQuery ? (
              <View className="py-8 items-center">
                <Text className="font-sans text-gray-500 text-center">
                  No restaurants found matching "{searchQuery}"
                </Text>
              </View>
            ) : (
              filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onPress={() =>
                    router.push(`/(home)/restaurant/${restaurant.id}`)
                  }
                />
              ))
            )}
          </ScrollView>
        )}
      </SignedIn>

      {/* SIGNED OUT */}
      <SignedOut>
        <View className="flex-1 justify-center items-center">
          <Link href="../sign-in">
            <Text className="font-sans text-[#F05A28] text-lg font-semibold">Sign in</Text>
          </Link>
        </View>
      </SignedOut>
    </View>
  )
}