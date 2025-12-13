export interface SpecialOffer {
  id: number
  restaurant: string
  rating: number
  price: string
  imageUrl: string
  bgColor: string
}

export const SPECIAL_OFFERS: SpecialOffer[] = [
  {
    id: 1,
    restaurant: 'Burger King',
    rating: 4.5,
    price: '$22.00',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    bgColor: '#FF6B57',
  },
  {
    id: 2,
    restaurant: 'McDonald\'s',
    rating: 4.5,
    price: '$22.00',
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    bgColor: '#6CD39C',
  },
]