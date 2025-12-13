export interface Category {
  id: string
  name: string
  icon: string
}

export const CATEGORIES: Category[] = [
  { id: 'burger', name: 'Burger', icon: '🍔' },
  { id: 'donats', name: 'Donats', icon: '🍩' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'hotdog', name: 'Hot Dog', icon: '🌭' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
]