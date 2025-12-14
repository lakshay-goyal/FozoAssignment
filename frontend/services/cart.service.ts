const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL

if (!BACKEND_URL) {
  console.warn('EXPO_PUBLIC_BACKEND_URL is not configured')
}

interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
}

export interface CartItem {
  id: number
  menuId: number
  quantity: number
  menu: {
    id: number
    item_name: string
    price: number
    imageUrl: string | null
    description: string | null
    isVeg: boolean
    restaurantId: number
    restaurant: {
      id: number
      name: string
      imageUrl: string | null
    }
  }
  createdAt: string
  updatedAt: string
}

export const cartService = {
  async addToCart(username: string, menuId: number, quantity: number): Promise<CartItem> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, menuId, quantity }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to add item to cart' }))
      throw new Error(errorData.message || 'Failed to add item to cart')
    }

    const data: ApiResponse<CartItem> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to add item to cart')
  },

  async getCart(username: string): Promise<CartItem[]> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch cart' }))
      throw new Error(errorData.message || 'Failed to fetch cart')
    }

    const data: ApiResponse<CartItem[]> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to fetch cart')
  },

  async updateCart(username: string, cartId: number, quantity: number): Promise<CartItem> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, cartId, quantity }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to update cart' }))
      throw new Error(errorData.message || 'Failed to update cart')
    }

    const data: ApiResponse<CartItem> = await response.json()
    
    if (data.success && data.data) {
      return data.data
    }
    
    throw new Error(data.message || 'Failed to update cart')
  },

  async removeFromCart(username: string, cartId: number): Promise<void> {
    if (!BACKEND_URL) {
      throw new Error('Backend URL is not configured')
    }

    const response = await fetch(`${BACKEND_URL}/cart/remove`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, cartId }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to remove item from cart' }))
      throw new Error(errorData.message || 'Failed to remove item from cart')
    }

    const data: ApiResponse<null> = await response.json()
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to remove item from cart')
    }
  },
}

