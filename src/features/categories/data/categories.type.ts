export type CategoryItem = {
  id: number
  name: string
  parent_id: number | null
  parent_name: string | null
  level: number
  order_level: number
  banner: string | null
  icon: string | null
  cover_image: string | null
  featured: boolean
  hot_category: boolean
  commision_rate: number
  digital: boolean
  slug: string
  [key: string]: unknown
}

export type CategoryFormData = {
  name: string
  parent_id: number | null
  order_level: number
  featured: boolean
  hot_category: boolean
  commision_rate: number
  digital: boolean
}
