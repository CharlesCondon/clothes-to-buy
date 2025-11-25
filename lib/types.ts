export interface Product {
  id: string
  user_id?: string
  url: string
  name: string | null
  brand: string | null
  price: number | null
  currency: string
  image_url: string | null
  category: string | null
  created_at: string
  updated_at: string
}

export type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a' | 'price-low' | 'price-high'

export type CategoryFilter = 'all' | 'shirts' | 'pants' | 'shoes' | 'accessories' | 'outerwear' | 'other'