import { useState, useEffect } from 'react'
import { restaurantService } from '../../../services'
import type { RestaurantWithDistance } from '../../../types'

interface UseRestaurantsReturn {
  restaurants: RestaurantWithDistance[]
  loading: boolean
  error: string | null
  refreshing: boolean
  fetchRestaurants: () => Promise<void>
  setRefreshing: (value: boolean) => void
}

export const useRestaurants = (username: string | undefined): UseRestaurantsReturn => {
  const [restaurants, setRestaurants] = useState<RestaurantWithDistance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchRestaurants = async () => {
    if (!username) {
      setError('User not found')
      setLoading(false)
      return
    }

    try {
      const data = await restaurantService.getRestaurants(username)
      setRestaurants(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (username) {
      fetchRestaurants()
    }
  }, [username])

  return {
    restaurants,
    loading,
    error,
    refreshing,
    fetchRestaurants,
    setRefreshing,
  }
}

