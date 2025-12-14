import type { RestaurantWithDistance } from '../types'

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
  console.warn('EXPO_PUBLIC_BACKEND_URL is not configured')
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export const restaurantService = {
  async getRestaurants(
    username: string,
    coordinates?: { latitude: number; longitude: number }
  ): Promise<RestaurantWithDistance[]> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/restaurants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        ...(coordinates && {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch restaurants' }))
      throw new Error(errorData.message || 'Failed to fetch restaurants')
    }

    const data: ApiResponse<RestaurantWithDistance[]> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to fetch restaurants')
  },

  async getRestaurantById(
    restaurantId: string,
    username: string,
    coordinates?: { latitude: number; longitude: number }
  ): Promise<RestaurantWithDistance> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/restaurants/${restaurantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        ...(coordinates && {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch restaurant' }))
      throw new Error(errorData.message || 'Failed to fetch restaurant')
    }

    const data: ApiResponse<RestaurantWithDistance> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to fetch restaurant')
  },
}