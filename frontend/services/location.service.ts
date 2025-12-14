const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
  console.warn('EXPO_PUBLIC_BACKEND_URL is not configured')
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface LocationSuggestion {
  place_id: string
  description: string
  structured_formatting?: {
    main_text: string
    secondary_text: string
  }
  geometry?: {
    location: {
      lat: number
      lng: number
    }
  }
}

export interface ReverseGeocodeResponse {
  address: string
  city: string
  state: string
  latitude: number
  longitude: number
}

export const locationService = {
  async getLocationSuggestions(input: string): Promise<LocationSuggestion[]> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    if (!input || input.trim().length === 0) {
      return []
    }

    const url = `${BACKEND_URL}/location/autocomplete?input=${encodeURIComponent(input.trim())}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        let errorData
        try {
          const text = await response.text()
          errorData = JSON.parse(text)
        } catch (parseError) {
          errorData = { message: 'Failed to fetch location suggestions' }
        }

        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const responseText = await response.text()

      let data: ApiResponse<LocationSuggestion[]>
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        throw new Error('Invalid JSON response from server')
      }

      if (data.success && data.data) {
        return data.data
      }

      return []
    } catch (error: any) {
      throw error
    }
  },

  async reverseGeocode(lat: number, lng: number): Promise<ReverseGeocodeResponse> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const url = `${BACKEND_URL}/location/reverse-geocode?lat=${lat}&lng=${lng}`

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to reverse geocode' }))
        throw new Error(errorData.message || 'Failed to reverse geocode')
      }

      const data: ApiResponse<ReverseGeocodeResponse> = await response.json()

      if (data.success && data.data) {
        return data.data
      }

      throw new Error(data.message || 'Failed to reverse geocode')
    } catch (error: any) {
      throw error
    }
  },
}