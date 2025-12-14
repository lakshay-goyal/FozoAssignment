import { useState } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { ProfilePopup } from '../../components/common'
import {
  HomeHeader,
  CategoryList,
  SpecialOffersSection,
  RestaurantsSection,
} from '../../components/home'
import { useRestaurants, useUserLocation } from './hooks'
import { useAddress } from '../../contexts/AddressContext'
import { CATEGORIES, SPECIAL_OFFERS } from './constants'
import { SignedOutView } from './components'

export default function Page() {
  const { user } = useUser()
  const { selectedAddress } = useAddress()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Pizza')
  const [showProfilePopup, setShowProfilePopup] = useState(false)

  const {
    restaurants,
    loading,
    error,
    refreshing,
    fetchRestaurants,
    setRefreshing,
  } = useRestaurants(user?.username || undefined)

  const { address: defaultAddress } = useUserLocation(user?.username || undefined)
  
  const displayAddress = selectedAddress?.address || defaultAddress

  const onRefresh = () => {
    setRefreshing(true)
    fetchRestaurants()
  }

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
          <HomeHeader
            address={displayAddress}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onProfilePress={() => setShowProfilePopup(true)}
          />

          <CategoryList
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />

          <SpecialOffersSection offers={SPECIAL_OFFERS} />

          <RestaurantsSection
            restaurants={restaurants}
            loading={loading}
            error={error}
            searchQuery={searchQuery}
            onRetry={fetchRestaurants}
          />
        </ScrollView>

        <ProfilePopup
          visible={showProfilePopup}
          onClose={() => setShowProfilePopup(false)}
        />
      </SignedIn>

      <SignedOut>
        <SignedOutView />
      </SignedOut>
    </View>
  )
}