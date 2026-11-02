export type BrandItem = {
  id: number
  name: string
  logo: string | null
  top: boolean
  slug: string
  [key: string]: unknown
}

export type BrandFormData = {
  name: string
  top: boolean
}
