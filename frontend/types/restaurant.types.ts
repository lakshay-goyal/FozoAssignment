export interface RestaurantWithDistance {
  id: number
  name: string
  description: string | null
  tags: string[]
  latitude: number
  longitude: number
  distance: number
  createdAt: string
  updatedAt: string
}

