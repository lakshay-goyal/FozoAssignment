export interface MenuItem {
  id: number
  item_name: string
  price: number
  imageUrl: string | null
  description: string | null
  isVeg: boolean
  restaurantId: number
  createdAt: string
  updatedAt: string
}

export interface RestaurantWithDistance {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  tags: string[]
  latitude: number
  longitude: number
  distance: number
  menu?: MenuItem[]
  createdAt: string
  updatedAt: string
}

