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
  Image,
} from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import * as Location from 'expo-location'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated'
import { Menu, Bell, ShoppingCart, User, Home, Heart, Clock, Truck } from 'lucide-react-native'
import { RestaurantCard } from '../../components/restaurant/RestaurantCard'
import { ProfilePopup } from '../../components/ProfilePopup'
import { restaurantService } from '../../services/restaurant.service'
import { userService } from '../../services/user.service'
import type { RestaurantWithDistance } from '../../types/restaurant.types'
import { fontFamily } from '../../fonts'
import { ChevronDown } from 'lucide-react-native'

const { width: screenWidth } = Dimensions.get('window')

// Category Item Component with Animation
const CategoryItem = ({
  category,
  isSelected,
  onPress,
}: {
  category: { id: string; name: string; icon: string }
  isSelected: boolean
  onPress: () => void
}) => {
  const scale = useSharedValue(1)
  const progress = useSharedValue(isSelected ? 1 : 0)
  const shadowOpacity = useSharedValue(isSelected ? 0.3 : 0)

  useEffect(() => {
    progress.value = withTiming(isSelected ? 1 : 0, { duration: 300 })
    shadowOpacity.value = withTiming(isSelected ? 0.3 : 0, { duration: 300 })
  }, [isSelected])

  const animatedParentStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', '#6ED39D']
    ),
    shadowOpacity: shadowOpacity.value,
    transform: [{ scale: scale.value }],
  }))

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      ['#333333', '#FFFFFF']
    ),
  }))

  const handlePress = () => {
    scale.value = withSpring(0.9, { damping: 10, stiffness: 200 }, () => {
      scale.value = withSpring(1, { damping: 10, stiffness: 200, mass: 1 })
    })
    onPress()
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={{ width: 60, height: 93 }}
    >
      <Animated.View
        className="w-[60px] h-[85px] rounded-full items-center justify-center"
        style={[
          animatedParentStyle,
          {
            shadowColor: '#9EECC1',
            shadowOffset: { width: 0, height: 20 },
            shadowRadius: 30,
            elevation: 5,
          },
        ]}
      >
        {/* Icon Container */}
        <View
          className="w-[50px] h-[50px] rounded-full items-center justify-center mb-2"
          style={{
            backgroundColor: '#FFFFFF',
            shadowColor: '#D3D1D8',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.251,
            shadowRadius: 30,
            elevation: 5,
          }}
        >
          <Text className="text-2xl">{category.icon}</Text>
        </View>
        
        {/* Category Name */}
        <Animated.Text
          style={[
            animatedTextStyle,
            {
              fontFamily: isSelected ? fontFamily.semiBold : fontFamily.regular,
              fontSize: 10,
              lineHeight: 15,
              textAlign: 'center',
            },
          ]}
        >
          {category.name}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  )
}

export default function Page() {
  const { user } = useUser()
  const router = useRouter()

  const [restaurants, setRestaurants] = useState<RestaurantWithDistance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userAddress, setUserAddress] = useState<string>('387 Merdina')
  const [selectedCategory, setSelectedCategory] = useState('Pizza')
  const [showProfilePopup, setShowProfilePopup] = useState(false)

  const scrollRef = useRef<ScrollView>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Categories data
  const categories = [
    { id: 'burger', name: 'Burger', icon: '🍔' },
    { id: 'donats', name: 'Donats', icon: '🍩' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'hotdog', name: 'Hot Dog', icon: '🌭' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
  ]

  // Special offers data
  const specialOffers = [
    {
      id: 1,
      restaurant: 'Burger King',
      rating: 4.5,
      price: '$22.00',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      bgColor: '#FF6B57',
    },
    {
      id: 2,
      restaurant: 'McDonald\'s',
      rating: 4.5,
      price: '$22.00',
      imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
      bgColor: '#6CD39C',
    },
  ]

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
    <View className="flex-1 bg-white">
      <SignedIn>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FF6B57"
            />
          }
        >
          {/* HEADER */}
          <View className="px-6 pt-12 pb-4">
            <View className="flex-row justify-between items-center mb-4 gap-6">
              {/* Menu Button */}
              <TouchableOpacity
                className="w-10 h-10 bg-white rounded-lg items-center justify-center shadow-sm"
                style={{
                  shadowColor: '#D3D1D8',
                  shadowOffset: { width: 5, height: 10 },
                  shadowOpacity: 0.3,
                  shadowRadius: 20,
                  elevation: 5,
                }}
              >
                <Menu size={20} color="#111719" strokeWidth={2} />
              </TouchableOpacity>

              {/* Location */}
              <View className="flex-1 items-center gap-3">
                <View className="flex-row items-center border border-gray-200 rounded-full px-2 py-1">
                  <Text
                    style={{ fontFamily: fontFamily.medium }}
                    className="text-[13px] text-[#737477] mr-1"
                  >
                    Deliver to
                  </Text>
                  <ChevronDown size={15} color="#737477" />
                </View>
                <Text
                  style={{ fontFamily: fontFamily.medium }}
                  className="text-[13px] text-[#242731] mt-0.5 text-center"
                >
                  {userAddress}
                </Text>
              </View>

              {/* Profile with Notification Badge */}
              <View className="relative">
                <TouchableOpacity
                  className="w-10 h-10 rounded-[10px] overflow-hidden"
                  onPress={() => setShowProfilePopup(true)}
                  style={{
                    shadowColor: '#D3D1D8',
                    shadowOffset: { width: 5, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={{ uri: user?.imageUrl || 'https://via.placeholder.com/40' }}
                    className="w-full h-full"
                  />
                </TouchableOpacity>
                <View className="absolute -top-1 -right-1 w-4 h-4 bg-[#FFC529] rounded-full items-center justify-center">
                  <Text
                    style={{ fontFamily: fontFamily.semiBold }}
                    className="text-[9px] text-white"
                  >
                    2
                  </Text>
                </View>
              </View>
            </View>

            {/* Good Afternoon! Greeting */}
            <View className="mb-4">
              <Text
                style={{
                  fontFamily: fontFamily.bold,
                  fontSize: 20,
                  lineHeight: 30,
                  color: '#FE724D',
                }}
              >
                Good Afternoon!
              </Text>
            </View>

            {/* Search Bar */}
            <View
              className="flex-row items-center bg-[#F9F9FA] rounded-[15px] px-4 py-3"
              style={{ height: 50 }}
            >
              <View className="w-4 h-4 border-2 border-[#A0A5BA] rounded-full mr-3" />
              <TextInput
                placeholder="Search dishes, restaurants"
                placeholderTextColor="#A9ABB4"
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: 12,
                  lineHeight: 18,
                  flex: 1,
                }}
                className="text-[#242731]"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* CATEGORIES */}
          <View className="mb-6">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}
            >
              {categories.map((category) => {
                const isSelected = selectedCategory === category.name
                return (
                  <CategoryItem
                    key={category.id}
                    category={category}
                    isSelected={isSelected}
                    onPress={() => setSelectedCategory(category.name)}
                  />
                )
              })}
            </ScrollView>
          </View>

          {/* SPECIAL OFFERS */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text
                style={{ fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 27 }}
                className="text-[#242731]"
              >
                Special Offers
              </Text>
              <Text
                style={{ fontFamily: fontFamily.medium, fontSize: 11, lineHeight: 16 }}
                className="text-[#FF6B57]"
              >
                View All
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
            >
              {specialOffers.map((offer) => (
                <View
                  key={offer.id}
                  className="rounded-[15px] overflow-hidden"
                  style={{
                    width: 256,
                    height: 110,
                    backgroundColor: offer.bgColor,
                    shadowColor: offer.bgColor === '#FF6B57' ? '#FE754C' : '#70D09A',
                    shadowOffset: { width: 10, height: 10 },
                    shadowOpacity: 0.25,
                    shadowRadius: 30,
                    elevation: 5,
                  }}
                >
                  <View className="flex-row h-full">
                    <View className="flex-1 p-4 justify-between">
                      <View className="flex-row items-center gap-1 mb-1">
                        <Text
                          style={{ fontFamily: fontFamily.regular, fontSize: 10, lineHeight: 12 }}
                          className="text-white"
                        >
                          ⭐
                        </Text>
                        <Text
                          style={{ fontFamily: fontFamily.regular, fontSize: 10, lineHeight: 12 }}
                          className="text-white"
                        >
                          {offer.rating}
                        </Text>
                      </View>
                      <Text
                        style={{ fontFamily: fontFamily.semiBold, fontSize: 16, lineHeight: 24 }}
                        className="text-white mb-1"
                      >
                        {offer.restaurant}
                      </Text>
                      <View className="flex-row items-center gap-1 mb-2">
                        <Truck size={14} color={offer.bgColor === '#FF6B57' ? '#FFB8AE' : '#A7ECBB'} />
                        <Text
                          style={{ fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 14 }}
                          className="text-white"
                        >
                          Free delivery
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-between">
                        <TouchableOpacity
                          className="px-3 py-1 rounded-[15px]"
                          style={{
                            backgroundColor: offer.bgColor === '#FF6B57' ? '#E54630' : '#51B781',
                          }}
                        >
                          <Text
                            style={{ fontFamily: fontFamily.semiBold, fontSize: 10, lineHeight: 15 }}
                            className="text-white"
                          >
                            Buy Now
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={{ fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 14 }}
                          className="text-white"
                        >
                          {offer.price}
                        </Text>
                      </View>
                    </View>
                    <View className="w-[116px] h-full">
                      <Image
                        source={{ uri: offer.imageUrl }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>


          {/* RESTAURANTS */}
          <View className="mb-24">
            <View className="flex-row justify-between items-center px-6 mb-4">
              <Text
                style={{ fontFamily: fontFamily.semiBold, fontSize: 18, lineHeight: 27 }}
                className="text-[#32343E]"
              >
                Restaurants
              </Text>
              <Text
                style={{ fontFamily: fontFamily.medium, fontSize: 11, lineHeight: 16 }}
                className="text-[#FF6B57]"
              >
                View All
              </Text>
            </View>
            {loading && !refreshing ? (
              <View className="py-8 items-center">
                <ActivityIndicator size="large" color="#FF6B57" />
                <Text
                  style={{ fontFamily: fontFamily.regular }}
                  className="mt-3 text-gray-500"
                >
                  Loading restaurants...
                </Text>
              </View>
            ) : error ? (
              <View className="py-8 items-center px-6">
                <Text
                  style={{ fontFamily: fontFamily.regular }}
                  className="text-red-500 text-center mb-4"
                >
                  {error}
                </Text>
                <TouchableOpacity
                  onPress={fetchRestaurants}
                  className="bg-[#FF6B57] px-6 py-3 rounded-full"
                >
                  <Text
                    style={{ fontFamily: fontFamily.semiBold }}
                    className="text-white"
                  >
                    Retry
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
              >
                {filteredRestaurants.length === 0 && searchQuery ? (
                  <View className="py-8 items-center" style={{ width: screenWidth - 48 }}>
                    <Text
                      style={{ fontFamily: fontFamily.regular }}
                      className="text-gray-500 text-center"
                    >
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
          </View>
        </ScrollView>

        {/* BOTTOM NAVIGATION */}
        {/* <View
          className="absolute bottom-0 left-0 right-0 bg-[#242731] rounded-t-[15px]"
          style={{
            height: 59,
            shadowColor: '#3F4C5F',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <View className="flex-row justify-center items-center h-full" style={{ gap: 50 }}>
            <TouchableOpacity className="items-center">
              <Home size={20} color="#FF6B57" fill="#FF6B57" />
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <ShoppingCart size={28} color="#747785" />
            </TouchableOpacity>
            <TouchableOpacity className="items-center">
              <User size={26} color="#747785" fill="#747785" />
            </TouchableOpacity>
            <View className="relative items-center">
              <Bell size={28} color="#747785" />
              <View className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#FFC529] rounded-full items-center justify-center">
                <Text
                  style={{ fontFamily: fontFamily.semiBold, fontSize: 9, lineHeight: 14 }}
                  className="text-white"
                >
                  4
                </Text>
              </View>
            </View>
          </View>
          <View
            className="absolute bottom-0 left-[50px]"
            style={{
              width: 42,
              height: 3,
              backgroundColor: '#FF6B57',
              borderRadius: 4,
            }}
          />
        </View> */}
      </SignedIn>

      {/* SIGNED OUT */}
      <SignedOut>
        <View className="flex-1 justify-center items-center">
          <Link href="../sign-in">
            <Text className="font-sans text-[#F05A28] text-lg font-semibold">Sign in</Text>
          </Link>
        </View>
      </SignedOut>

      {/* Profile Popup */}
      <ProfilePopup
        visible={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
      />
    </View>
  )
}