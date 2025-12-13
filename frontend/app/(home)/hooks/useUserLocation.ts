import { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { userService } from '../../../services'

interface UseUserLocationReturn {
  address: string
  loading: boolean
  error: string | null
}

export const useUserLocation = (username: string | undefined): UseUserLocationReturn => {
  const [address, setAddress] = useState<string>('387 Merdina')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (!username) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const userData = await userService.getUserByUsername(username)
        
        // Reverse geocode coordinates to get address
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: userData.latitude,
          longitude: userData.longitude,
        })

        if (reverseGeocode && reverseGeocode.length > 0) {
          const addressData = reverseGeocode[0]
          // Format address: street, city, region, country
          const addressParts = [
            addressData.street,
            addressData.city,
            addressData.region,
            addressData.country,
          ].filter(Boolean)
          
          const formattedAddress = addressParts.length > 0 
            ? addressParts.join(', ')
            : `${addressData.streetNumber || ''} ${addressData.street || ''}`.trim() || 
              `${addressData.city || ''}, ${addressData.region || ''}`.trim() ||
              'Location not available'
          
          setAddress(formattedAddress)
        } else {
          setAddress('Location not available')
        }
        setError(null)
      } catch (err: any) {
        console.error('Failed to fetch user location:', err)
        setAddress('Location not available')
        setError(err.message || 'Failed to fetch location')
      } finally {
        setLoading(false)
      }
    }

    fetchUserLocation()
  }, [username])

  return { address, loading, error }
}

