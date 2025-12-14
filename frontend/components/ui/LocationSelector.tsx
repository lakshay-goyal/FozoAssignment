import { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { ChevronDown } from 'lucide-react-native'
import { useUser } from '@clerk/clerk-expo'
import * as Location from 'expo-location'
import { fontFamily } from '../../fonts'
import { LocationSelectorModal } from './LocationSelectorModal'
import { userService, type Address } from '../../services'
import { useAddress } from '../../contexts/AddressContext'

interface LocationSelectorProps {
  address: string
  onPress?: () => void
  onAddressSelect?: (address: Address) => void
}

export const LocationSelector = ({ address, onPress, onAddressSelect }: LocationSelectorProps) => {
  const { user } = useUser()
  const { selectedAddress, setSelectedAddress } = useAddress()
  const [showModal, setShowModal] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
    address: string
  } | undefined>(undefined)

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      if (!user?.username) return

      try {
        const userData = await userService.getUserByUsername(user.username)
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: userData.latitude,
          longitude: userData.longitude,
        })

        const addressString = reverseGeocode[0]
          ? `${reverseGeocode[0].street || ''} ${reverseGeocode[0].city || ''} ${reverseGeocode[0].region || ''}`.trim()
          : address

        setCurrentLocation({
          latitude: userData.latitude,
          longitude: userData.longitude,
          address: addressString,
        })
      } catch (error) {
        console.error('Error fetching current location:', error)
      }
    }

    fetchCurrentLocation()
  }, [user?.username, address])

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      setShowModal(true)
    }
  }

  const handleSelectAddress = (selectedAddress: Address) => {
    setSelectedAddress(selectedAddress)
    onAddressSelect?.(selectedAddress)
    setShowModal(false)
  }

  return (
    <>
      <View className="flex-1 items-center gap-3">
        <TouchableOpacity
          onPress={handlePress}
          className="flex-row items-center border border-gray-200 rounded-full px-2 py-1"
        >
          <Text
            style={{ fontFamily: fontFamily.medium }}
            className="text-[13px] text-[#737477] mr-1"
          >
            Deliver to
          </Text>
          <ChevronDown size={15} color="#737477" />
        </TouchableOpacity>
        <Text
          style={{ fontFamily: fontFamily.medium }}
          className="text-[13px] text-[#242731] mt-0.5 text-center"
          numberOfLines={1}
        >
          {selectedAddress?.address || address}
        </Text>
      </View>

      <LocationSelectorModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSelectAddress={handleSelectAddress}
        currentLocation={currentLocation}
      />
    </>
  )
}

