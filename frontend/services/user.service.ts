const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
  console.warn('EXPO_PUBLIC_BACKEND_URL is not configured')
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface User {
  id: number
  username: string
  email: string
  latitude: number
  longitude: number
}

export const userService = {
  async getUserByUsername(username: string): Promise<User> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/users/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch user' }))
      throw new Error(errorData.message || 'Failed to fetch user')
    }

    const data: ApiResponse<User> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to fetch user')
  },
}

