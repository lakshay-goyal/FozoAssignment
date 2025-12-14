import { useState, useEffect } from 'react'
import { restaurantService } from '../../../services'
import type { RestaurantWithDistance } from '../../../types'
import { useAddress } from '../../../contexts/AddressContext'

interface UseRestaurantReturn {
  restaurant: RestaurantWithDistance | null
  loading: boolean
  error: string | null
  fetchRestaurant: () => Promise<void>
}

export const useRestaurant = (
  restaurantId: string | string[] | undefined,
  username: string | undefined
): UseRestaurantReturn => {
  const { selectedAddress } = useAddress()
  const [restaurant, setRestaurant] = useState<RestaurantWithDistance | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRestaurant = async () => {
    if (!username || !restaurantId || Array.isArray(restaurantId)) {
      setError('User or restaurant ID not found')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      // Use selected address coordinates if available
      const coordinates = selectedAddress
        ? { latitude: selectedAddress.latitude, longitude: selectedAddress.longitude }
        : undefined

      const data = await restaurantService.getRestaurantById(restaurantId, username, coordinates)
      setRestaurant(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRestaurant()
  }, [restaurantId, username, selectedAddress])

  return {
    restaurant,
    loading,
    error,
    fetchRestaurant,
  }
}