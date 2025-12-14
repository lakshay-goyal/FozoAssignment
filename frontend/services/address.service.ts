const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
  console.warn('EXPO_PUBLIC_BACKEND_URL is not configured')
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface Address {
  id: number
  userId: number
  label: string
  address: string
  phoneNumber: string | null
  latitude: number
  longitude: number
  isDefault: boolean
  distance?: number
  createdAt: string
  updatedAt: string
}

export interface CreateAddressData {
  label: string
  address: string
  phoneNumber?: string
  latitude: number
  longitude: number
  isDefault?: boolean
}

export interface UpdateAddressData {
  label?: string
  address?: string
  phoneNumber?: string
  latitude?: number
  longitude?: number
  isDefault?: boolean
}

export const addressService = {
  async createAddress(username: string, addressData: CreateAddressData): Promise<Address> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/addresses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        ...addressData,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to create address' }))
      throw new Error(errorData.message || 'Failed to create address')
    }

    const data: ApiResponse<Address> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to create address')
  },

  async getAddresses(
    username: string,
    currentLocation?: { latitude: number; longitude: number }
  ): Promise<Address[]> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/addresses/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        ...(currentLocation && {
          currentLatitude: currentLocation.latitude,
          currentLongitude: currentLocation.longitude,
        }),
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch addresses' }))
      throw new Error(errorData.message || 'Failed to fetch addresses')
    }

    const data: ApiResponse<Address[]> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to fetch addresses')
  },

  async updateAddress(username: string, addressId: number, addressData: UpdateAddressData): Promise<Address> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/addresses/${addressId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        ...addressData,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update address' }))
      throw new Error(errorData.message || 'Failed to update address')
    }

    const data: ApiResponse<Address> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to update address')
  },

  async deleteAddress(username: string, addressId: number): Promise<void> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/addresses/${addressId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to delete address' }))
      throw new Error(errorData.message || 'Failed to delete address')
    }
  },
}