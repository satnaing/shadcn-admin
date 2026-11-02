export type CategoryMockItem = {
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

export type BrandMockItem = {
  id: number
  name: string
  logo: string | null
  top: boolean
  slug: string
  [key: string]: unknown
}

export type ColorMockItem = {
  id: number
  name: string
  code: string
  [key: string]: unknown
}

export type AttributeMockItem = {
  id: number
  name: string
  values: string[]
  [key: string]: unknown
}

export type UnitMockItem = {
  id: number
  name: string
  [key: string]: unknown
}

export const categoriesMock: CategoryMockItem[] = [
  {
    id: 1,
    name: 'Elektronika və Texnika',
    parent_id: null,
    parent_name: null,
    level: 0,
    order_level: 1,
    banner: null,
    icon: null,
    cover_image: null,
    featured: true,
    hot_category: true,
    commision_rate: 5,
    digital: false,
    slug: 'elektronika-ve-texnika',
  },
  {
    id: 2,
    name: 'Smartfonlar və Planşetlər',
    parent_id: 1,
    parent_name: 'Elektronika və Texnika',
    level: 1,
    order_level: 1,
    banner: null,
    icon: null,
    cover_image: null,
    featured: true,
    hot_category: true,
    commision_rate: 4,
    digital: false,
    slug: 'smartfonlar-ve-plansetler',
  },
  {
    id: 3,
    name: 'Noutbuklar və Kompüterlər',
    parent_id: 1,
    parent_name: 'Elektronika və Texnika',
    level: 1,
    order_level: 2,
    banner: null,
    icon: null,
    cover_image: null,
    featured: false,
    hot_category: false,
    commision_rate: 4.5,
    digital: false,
    slug: 'noutbuklar-ve-komputerler',
  },
  {
    id: 4,
    name: 'Geyim və Dəb',
    parent_id: null,
    parent_name: null,
    level: 0,
    order_level: 2,
    banner: null,
    icon: null,
    cover_image: null,
    featured: true,
    hot_category: false,
    commision_rate: 10,
    digital: false,
    slug: 'geyim-ve-deb',
  },
  {
    id: 5,
    name: 'Kişi Geyimləri',
    parent_id: 4,
    parent_name: 'Geyim və Dəb',
    level: 1,
    order_level: 1,
    banner: null,
    icon: null,
    cover_image: null,
    featured: false,
    hot_category: false,
    commision_rate: 8,
    digital: false,
    slug: 'kisi-geyimleri',
  },
  {
    id: 6,
    name: 'Rəqəmsal Proqram Təminatı',
    parent_id: null,
    parent_name: null,
    level: 0,
    order_level: 3,
    banner: null,
    icon: null,
    cover_image: null,
    featured: false,
    hot_category: false,
    commision_rate: 15,
    digital: true,
    slug: 'reqemsal-proqram-teminati',
  },
]

export const brandsMock: BrandMockItem[] = [
  { id: 1, name: 'Apple', logo: null, top: true, slug: 'apple' },
  { id: 2, name: 'Samsung', logo: null, top: true, slug: 'samsung' },
  { id: 3, name: 'Sony', logo: null, top: true, slug: 'sony' },
  { id: 4, name: 'Xiaomi', logo: null, top: false, slug: 'xiaomi' },
  { id: 5, name: 'Nike', logo: null, top: true, slug: 'nike' },
  { id: 6, name: 'Adidas', logo: null, top: true, slug: 'adidas' },
  { id: 7, name: 'Puma', logo: null, top: false, slug: 'puma' },
]

export const colorsMock: ColorMockItem[] = [
  { id: 1, name: 'Qara (Black)', code: '#000000' },
  { id: 2, name: 'Ağ (White)', code: '#FFFFFF' },
  { id: 3, name: 'Qırmızı (Red)', code: '#FF0000' },
  { id: 4, name: 'Mavi (Blue)', code: '#0000FF' },
  { id: 5, name: 'Qızılı (Gold)', code: '#FFD700' },
  { id: 6, name: 'Gümüşü (Silver)', code: '#C0C0C0' },
  { id: 7, name: 'Yaşıl (Green)', code: '#008000' },
]

export const attributesMock: AttributeMockItem[] = [
  { id: 1, name: 'Ölçü (Size)', values: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 2, name: 'Daxili Yaddaş (Storage)', values: ['64GB', '128GB', '256GB', '512GB', '1TB'] },
  { id: 3, name: 'Operativ Yaddaş (RAM)', values: ['4GB', '8GB', '16GB', '32GB', '64GB'] },
  { id: 4, name: 'Material', values: ['Dəri', 'Pambıq', 'Kətan', 'İpək'] },
]

export const unitsMock: UnitMockItem[] = [
  { id: 1, name: 'ədəd (pc)' },
  { id: 2, name: 'kiloqram (kg)' },
  { id: 3, name: 'litr (L)' },
  { id: 4, name: 'metr (m)' },
  { id: 5, name: 'paket (pack)' },
  { id: 6, name: 'qutu (box)' },
]
