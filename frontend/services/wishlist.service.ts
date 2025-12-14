const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
  console.warn('EXPO_PUBLIC_BACKEND_URL is not configured')
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface WishlistItem {
  id: number
  restaurantId: number
  restaurant: {
    id: number
    name: string
    description: string | null
    imageUrl: string | null
    tags: string[]
    latitude: number
    longitude: number
    distance?: number
  }
  createdAt: string
  updatedAt: string
}

export const wishlistService = {
  async addToWishlist(username: string, restaurantId: number): Promise<WishlistItem> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/wishlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, restaurantId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to add restaurant to wishlist' }))
      throw new Error(errorData.message || 'Failed to add restaurant to wishlist')
    }

    const data: ApiResponse<WishlistItem> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to add restaurant to wishlist')
  },

  async removeFromWishlist(username: string, restaurantId: number): Promise<void> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/wishlist/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, restaurantId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to remove restaurant from wishlist' }))
      throw new Error(errorData.message || 'Failed to remove restaurant from wishlist')
    }

    const data: ApiResponse<null> = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to remove restaurant from wishlist')
    }
  },

  async getWishlist(username: string): Promise<WishlistItem[]> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/wishlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch wishlist' }))
      throw new Error(errorData.message || 'Failed to fetch wishlist')
    }

    const data: ApiResponse<WishlistItem[]> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to fetch wishlist')
  },
}

