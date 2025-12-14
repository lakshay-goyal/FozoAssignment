import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { ChevronLeft, MapPin, Home, Plus, Target, Search, MoreVertical, Share2 } from 'lucide-react-native'
import { useUser } from '@clerk/clerk-expo'
import * as Location from 'expo-location'
import { fontFamily } from '../../fonts'
import { addressService, locationService, type Address, type LocationSuggestion } from '../../services'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.9

interface LocationSelectorModalProps {
  visible: boolean
  onClose: () => void
  onSelectAddress?: (address: Address) => void
  currentLocation?: {
    latitude: number
    longitude: number
    address: string
  }
}

interface AddAddressFormData {
  label: string
  address: string
  phoneNumber: string
  latitude: number
  longitude: number
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  visible,
  onClose,
  onSelectAddress,
  currentLocation,
}) => {
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [showAddAddressForm, setShowAddAddressForm] = useState(false)
  const [selectedSuggestionForAdd, setSelectedSuggestionForAdd] = useState<LocationSuggestion | null>(null)
  const [addAddressForm, setAddAddressForm] = useState<AddAddressFormData>({
    label: '',
    address: '',
    phoneNumber: '',
    latitude: 0,
    longitude: 0,
  })
  const [savingAddress, setSavingAddress] = useState(false)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const translateY = useSharedValue(MODAL_HEIGHT)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 90 })
      opacity.value = withTiming(1, { duration: 200 })
      fetchAddresses()
    } else {
      translateY.value = withSpring(MODAL_HEIGHT, { damping: 20, stiffness: 90 })
      opacity.value = withTiming(0, { duration: 200 })
    }
  }, [visible])

  const fetchAddresses = async () => {
    if (!user?.username) return

    try {
      setLoading(true)
      const userAddresses = await addressService.getAddresses(
        user.username,
        currentLocation ? { latitude: currentLocation.latitude, longitude: currentLocation.longitude } : undefined
      )
      setAddresses(userAddresses)
    } catch (error: any) {
      console.error('Error fetching addresses:', error)
      Alert.alert('Error', error.message || 'Failed to fetch addresses')
    } finally {
      setLoading(false)
    }
  }

  // Debounced search for location suggestions
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    if (!searchQuery.trim()) {
      setLocationSuggestions([])
      setSearching(false)
      return
    }

    setSearching(true)
    debounceTimer.current = setTimeout(async () => {
      try {
        const suggestions = await locationService.getLocationSuggestions(searchQuery)
        setLocationSuggestions(suggestions)
      } catch (error: any) {
        console.error('Error fetching location suggestions:', error)
        // Don't show alert for search errors, just log
      } finally {
        setSearching(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchQuery])

  const handleUseCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      const { latitude, longitude } = location.coords

      let addressString = 'Current Location'
      
      // Try backend reverse geocode first, fallback to expo-location
      try {
        const geocodeResult = await locationService.reverseGeocode(latitude, longitude)
        addressString = geocodeResult.address
      } catch (backendError: any) {
        console.warn('Backend reverse geocode failed, using expo-location fallback:', backendError)
        // Fallback to expo-location reverse geocode
        try {
          const reverseGeocode = await Location.reverseGeocodeAsync({ latitude, longitude })
          if (reverseGeocode && reverseGeocode.length > 0) {
            const addressData = reverseGeocode[0]
            const addressParts = [
              addressData.street,
              addressData.city,
              addressData.region,
              addressData.country,
            ].filter(Boolean)
            addressString = addressParts.length > 0 
              ? addressParts.join(', ')
              : `${addressData.streetNumber || ''} ${addressData.street || ''}`.trim() || 
                `${addressData.city || ''}, ${addressData.region || ''}`.trim() ||
                'Current Location'
          }
        } catch (expoError: any) {
          console.error('Expo location reverse geocode also failed:', expoError)
          // Use coordinates as fallback
          addressString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }
      }

      // Create a temporary address object
      const tempAddress: Address = {
        id: -1,
        userId: 0,
        label: 'Current Location',
        address: addressString,
        phoneNumber: null,
        latitude,
        longitude,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      onSelectAddress?.(tempAddress)
      onClose()
    } catch (error: any) {
      console.error('Error getting current location:', error)
      Alert.alert('Error', error.message || 'Failed to get current location')
    }
  }

  const handleSelectSuggestion = async (suggestion: LocationSuggestion) => {
    if (!suggestion.geometry?.location) {
      Alert.alert('Error', 'Location coordinates not available')
      return
    }

    const { lat, lng } = suggestion.geometry.location
    
    try {
      let addressString = suggestion.description
      
      // Try to get full address details via reverse geocode, but use suggestion description as fallback
      try {
        const geocodeResult = await locationService.reverseGeocode(lat, lng)
        addressString = geocodeResult.address || suggestion.description
      } catch (geocodeError: any) {
        console.warn('Reverse geocode failed, using suggestion description:', geocodeError)
        // Use the suggestion description as the address
        addressString = suggestion.description
      }
      
      // If user is searching, show add address form
      // Otherwise, use it directly
      if (showAddAddressForm) {
        setAddAddressForm({
          label: '',
          address: addressString,
          phoneNumber: '',
          latitude: lat,
          longitude: lng,
        })
        setSelectedSuggestionForAdd(suggestion)
        setSearchQuery('')
      } else {
        // Use as temporary address for selection
        const tempAddress: Address = {
          id: -1,
          userId: 0,
          label: suggestion.structured_formatting?.main_text || suggestion.description,
          address: addressString,
          phoneNumber: null,
          latitude: lat,
          longitude: lng,
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        onSelectAddress?.(tempAddress)
        setSearchQuery('')
        onClose()
      }
    } catch (error: any) {
      console.error('Error selecting suggestion:', error)
      Alert.alert('Error', error.message || 'Failed to select location')
    }
  }

  const handleAddAddress = () => {
    setShowAddAddressForm(true)
    setSearchQuery('')
    setLocationSuggestions([])
  }

  const handleSaveAddress = async () => {
    if (!user?.username) return

    if (!addAddressForm.label.trim()) {
      Alert.alert('Error', 'Please enter a label (e.g., Home, Work)')
      return
    }

    if (!addAddressForm.address.trim()) {
      Alert.alert('Error', 'Please select a location')
      return
    }

    try {
      setSavingAddress(true)
      await addressService.createAddress(user.username, {
        label: addAddressForm.label.trim(),
        address: addAddressForm.address,
        phoneNumber: addAddressForm.phoneNumber.trim() || undefined,
        latitude: addAddressForm.latitude,
        longitude: addAddressForm.longitude,
        isDefault: false,
      })

      // Reset form and refresh addresses
      setAddAddressForm({
        label: '',
        address: '',
        phoneNumber: '',
        latitude: 0,
        longitude: 0,
      })
      setShowAddAddressForm(false)
      setSelectedSuggestionForAdd(null)
      await fetchAddresses()
      Alert.alert('Success', 'Address added successfully')
    } catch (error: any) {
      console.error('Error saving address:', error)
      Alert.alert('Error', error.message || 'Failed to save address')
    } finally {
      setSavingAddress(false)
    }
  }

  const handleCancelAddAddress = () => {
    setShowAddAddressForm(false)
    setAddAddressForm({
      label: '',
      address: '',
      phoneNumber: '',
      latitude: 0,
      longitude: 0,
    })
    setSelectedSuggestionForAdd(null)
    setSearchQuery('')
  }

  const handleSelectAddress = (address: Address) => {
    onSelectAddress?.(address)
    onClose()
  }

  const handleDeleteAddress = async (addressId: number) => {
    if (!user?.username) return

    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await addressService.deleteAddress(user.username!, addressId)
              fetchAddresses()
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete address')
            }
          },
        },
      ]
    )
  }

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        translateY.value = withSpring(MODAL_HEIGHT, { damping: 20, stiffness: 90 })
        opacity.value = withTiming(0, { duration: 200 })
        runOnJS(onClose)()
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 90 })
      }
    })

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }))

  const filteredAddresses = searchQuery.trim()
    ? addresses.filter((addr) =>
        addr.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addr.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : addresses

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1">
        {/* Backdrop */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000',
            },
            backdropStyle,
          ]}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>

        {/* Modal Content */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: MODAL_HEIGHT,
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
              modalStyle,
            ]}
          >
            {/* Handle */}
            <View className="w-full items-center pt-3 pb-2">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Header */}
            <View className="flex-row items-center px-5 pb-4">
              <TouchableOpacity onPress={onClose} className="mr-4">
                <ChevronLeft size={24} color="#111" />
              </TouchableOpacity>
              <Text
                style={{ fontFamily: fontFamily.bold }}
                className="text-xl text-black flex-1"
              >
                Select a location
              </Text>
            </View>

            {/* Search Bar */}
            <View className="px-5 mb-4">
              <View className="flex-row items-center bg-[#F9F9FA] rounded-[15px] px-4 py-3">
                <Search size={16} color="#A9ABB4" />
                <TextInput
                  placeholder={showAddAddressForm ? "Search for location to add..." : "Search for area, street name..."}
                  placeholderTextColor="#A9ABB4"
                  style={{
                    fontFamily: fontFamily.regular,
                    fontSize: 14,
                    flex: 1,
                    marginLeft: 8,
                    color: '#242731',
                  }}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <ScrollView
              className="flex-1"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Location Suggestions from Search */}
              {searchQuery.trim() && locationSuggestions.length > 0 && (
                <View className="mb-4">
                  <Text
                    style={{ fontFamily: fontFamily.semiBold }}
                    className="text-xs text-gray-500 uppercase px-5 mb-3"
                  >
                    {showAddAddressForm ? 'SELECT LOCATION' : 'SUGGESTIONS'}
                  </Text>
                  {locationSuggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion.place_id}
                      onPress={() => handleSelectSuggestion(suggestion)}
                      className="px-5 py-4 border-b border-gray-100"
                    >
                      <View className="flex-row items-start">
                        <View className="mr-3 mt-0.5">
                          <MapPin size={20} color="#C83A1A" />
                        </View>
                        <View className="flex-1">
                          <Text
                            style={{ fontFamily: fontFamily.medium }}
                            className="text-base text-black"
                          >
                            {suggestion.structured_formatting?.main_text || suggestion.description}
                          </Text>
                          {suggestion.structured_formatting?.secondary_text && (
                            <Text
                              style={{ fontFamily: fontFamily.regular }}
                              className="text-sm text-gray-600 mt-1"
                            >
                              {suggestion.structured_formatting.secondary_text}
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {searching && (
                <View className="px-5 py-4 items-center">
                  <Text style={{ fontFamily: fontFamily.regular }} className="text-gray-500">
                    Searching...
                  </Text>
                </View>
              )}

              {/* Use Current Location */}
              {currentLocation && (
                <TouchableOpacity
                  onPress={handleUseCurrentLocation}
                  className="flex-row items-center px-5 py-4 border-b border-gray-100"
                >
                  <Target size={20} color="#C83A1A" />
                  <View className="flex-1 ml-3">
                    <Text
                      style={{ fontFamily: fontFamily.medium }}
                      className="text-base text-black"
                    >
                      Use current location
                    </Text>
                    <Text
                      style={{ fontFamily: fontFamily.regular }}
                      className="text-sm text-gray-600 mt-1"
                    >
                      {currentLocation.address}
                    </Text>
                  </View>
                  <ChevronLeft size={20} color="#A9ABB4" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
              )}

              {/* Add Address Form */}
              {showAddAddressForm ? (
                <View className="px-5 py-4 border-b border-gray-100 bg-gray-50">
                  <View className="mb-4">
                    <Text
                      style={{ fontFamily: fontFamily.semiBold }}
                      className="text-base text-black mb-3"
                    >
                      Add New Address
                    </Text>
                    
                    {/* Label Input */}
                    <View className="mb-3">
                      <Text
                        style={{ fontFamily: fontFamily.medium }}
                        className="text-sm text-gray-700 mb-2"
                      >
                        Label (e.g., Home, Work)
                      </Text>
                      <TextInput
                        placeholder="Home, Work, etc."
                        placeholderTextColor="#A9ABB4"
                        style={{
                          fontFamily: fontFamily.regular,
                          fontSize: 14,
                          backgroundColor: '#FFFFFF',
                          borderRadius: 10,
                          padding: 12,
                          borderWidth: 1,
                          borderColor: '#E5E5E5',
                          color: '#242731',
                        }}
                        value={addAddressForm.label}
                        onChangeText={(text) => setAddAddressForm({ ...addAddressForm, label: text })}
                      />
                    </View>

                    {/* Address Display */}
                    {addAddressForm.address ? (
                      <View className="mb-3">
                        <Text
                          style={{ fontFamily: fontFamily.medium }}
                          className="text-sm text-gray-700 mb-2"
                        >
                          Address
                        </Text>
                        <View className="bg-white rounded-lg p-3 border border-gray-200">
                          <Text
                            style={{ fontFamily: fontFamily.regular }}
                            className="text-sm text-gray-800"
                          >
                            {addAddressForm.address}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View className="mb-3">
                        <Text
                          style={{ fontFamily: fontFamily.medium }}
                          className="text-sm text-gray-700 mb-2"
                        >
                          Search and select a location
                        </Text>
                        <Text
                          style={{ fontFamily: fontFamily.regular }}
                          className="text-xs text-gray-500"
                        >
                          Use the search bar above to find and select a location
                        </Text>
                      </View>
                    )}

                    {/* Phone Number Input (Optional) */}
                    <View className="mb-4">
                      <Text
                        style={{ fontFamily: fontFamily.medium }}
                        className="text-sm text-gray-700 mb-2"
                      >
                        Phone Number (Optional)
                      </Text>
                      <TextInput
                        placeholder="+91-XXXXXXXXXX"
                        placeholderTextColor="#A9ABB4"
                        keyboardType="phone-pad"
                        style={{
                          fontFamily: fontFamily.regular,
                          fontSize: 14,
                          backgroundColor: '#FFFFFF',
                          borderRadius: 10,
                          padding: 12,
                          borderWidth: 1,
                          borderColor: '#E5E5E5',
                          color: '#242731',
                        }}
                        value={addAddressForm.phoneNumber}
                        onChangeText={(text) => setAddAddressForm({ ...addAddressForm, phoneNumber: text })}
                      />
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-3">
                      <TouchableOpacity
                        onPress={handleCancelAddAddress}
                        className="flex-1 bg-gray-200 rounded-lg py-3 items-center"
                      >
                        <Text
                          style={{ fontFamily: fontFamily.medium }}
                          className="text-base text-gray-700"
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveAddress}
                        disabled={savingAddress || !addAddressForm.label.trim() || !addAddressForm.address.trim()}
                        className="flex-1 bg-[#C83A1A] rounded-lg py-3 items-center"
                        style={{
                          opacity: savingAddress || !addAddressForm.label.trim() || !addAddressForm.address.trim() ? 0.5 : 1,
                        }}
                      >
                        <Text
                          style={{ fontFamily: fontFamily.medium }}
                          className="text-base text-white"
                        >
                          {savingAddress ? 'Saving...' : 'Save Address'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                /* Add Address Button */
                <TouchableOpacity
                  onPress={handleAddAddress}
                  className="flex-row items-center px-5 py-4 border-b border-gray-100"
                >
                  <View className="w-5 h-5 items-center justify-center">
                    <Plus size={16} color="#C83A1A" />
                  </View>
                  <Text
                    style={{ fontFamily: fontFamily.medium }}
                    className="text-base text-black ml-3 flex-1"
                  >
                    Add Address
                  </Text>
                  <ChevronLeft size={20} color="#A9ABB4" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
              )}

              {/* Saved Addresses */}
              {filteredAddresses.length > 0 && (
                <View className="mt-4">
                  <Text
                    style={{ fontFamily: fontFamily.semiBold }}
                    className="text-xs text-gray-500 uppercase px-5 mb-3"
                  >
                    SAVED ADDRESSES
                  </Text>
                  {filteredAddresses.map((address) => (
                    <TouchableOpacity
                      key={address.id}
                      onPress={() => handleSelectAddress(address)}
                      className="px-5 py-4 border-b border-gray-100"
                    >
                      <View className="flex-row items-start">
                        <View className="items-center mr-3">
                          <Home size={20} color="#C83A1A" />
                          <Text
                            style={{ fontFamily: fontFamily.regular }}
                            className="text-xs text-gray-500 mt-1"
                          >
                            {address.distance !== undefined ? `${address.distance} m` : '0 m'}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text
                            style={{ fontFamily: fontFamily.bold }}
                            className="text-base text-black"
                          >
                            {address.label}
                          </Text>
                          <Text
                            style={{ fontFamily: fontFamily.regular }}
                            className="text-sm text-gray-600 mt-1"
                          >
                            {address.address}
                          </Text>
                          {address.phoneNumber && (
                            <Text
                              style={{ fontFamily: fontFamily.regular }}
                              className="text-sm text-gray-500 mt-1"
                            >
                              Phone number: {address.phoneNumber}
                            </Text>
                          )}
                        </View>
                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            onPress={() => handleDeleteAddress(address.id)}
                            className="w-8 h-8 rounded-full items-center justify-center"
                          >
                            <MoreVertical size={18} color="#C83A1A" />
                          </TouchableOpacity>
                          <TouchableOpacity className="w-8 h-8 rounded-full items-center justify-center">
                            <Share2 size={18} color="#C83A1A" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}


              {loading && (
                <View className="py-8 items-center">
                  <Text style={{ fontFamily: fontFamily.regular }} className="text-gray-500">
                    Loading addresses...
                  </Text>
                </View>
              )}

              {!loading && 
               !searching && 
               filteredAddresses.length === 0 && 
               locationSuggestions.length === 0 && 
               searchQuery === '' && (
                <View className="py-8 items-center">
                  <Text style={{ fontFamily: fontFamily.regular }} className="text-gray-500">
                    No saved addresses
                  </Text>
                </View>
              )}

              {!loading && 
               !searching && 
               filteredAddresses.length === 0 && 
               locationSuggestions.length === 0 && 
               searchQuery.trim() !== '' && (
                <View className="py-8 items-center">
                  <Text style={{ fontFamily: fontFamily.regular }} className="text-gray-500">
                    No results found
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  )
}