import type {
  DashboardStatsResponse,
  RankingPeriod,
  TopCategoryGroup,
  InhouseTopCategory,
  InhouseTopBrand,
  TopSellerGroup,
  TopBrandGroup,
} from '@/features/dashboard/data/dashboard.type'

const sampleProducts = [
  {
    id: 101,
    name: 'iPhone 15 Pro Max 256GB Titanium',
    slug: 'iphone-15-pro-max-256gb',
    image: null,
    sales: 145,
    total: 362500,
  },
  {
    id: 102,
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra',
    image: null,
    sales: 98,
    total: 215600,
  },
  {
    id: 103,
    name: 'MacBook Air 15 M3 16GB / 512GB',
    slug: 'macbook-air-15-m3',
    image: null,
    sales: 64,
    total: 179200,
  },
  {
    id: 104,
    name: 'Sony WH-1000XM5 ANC Headphones',
    slug: 'sony-wh-1000xm5-headphones',
    image: null,
    sales: 210,
    total: 84000,
  },
]

const sampleCategories: TopCategoryGroup[] = [
  {
    category_id: 1,
    category_name: 'Smartfonlar və Planşetlər',
    cover_image: null,
    products: sampleProducts,
  },
  {
    category_id: 2,
    category_name: 'Noutbuklar və Kompüterlər',
    cover_image: null,
    products: [sampleProducts[2], sampleProducts[3]],
  },
  {
    category_id: 3,
    category_name: 'Audio və Video Texnika',
    cover_image: null,
    products: [sampleProducts[3], sampleProducts[0]],
  },
]

const sampleInhouseCategories: InhouseTopCategory[] = [
  { id: 1, name: 'Smartfonlar', cover_image: null, total: 148500 },
  { id: 2, name: 'Noutbuklar', cover_image: null, total: 112000 },
  { id: 3, name: 'Smart Saatlar', cover_image: null, total: 54300 },
  { id: 4, name: 'Aksesuarlar', cover_image: null, total: 29800 },
]

const sampleInhouseBrands: InhouseTopBrand[] = [
  { id: 1, name: 'Apple', logo: null, total: 185000 },
  { id: 2, name: 'Samsung', logo: null, total: 124000 },
  { id: 3, name: 'Sony', logo: null, total: 68500 },
  { id: 4, name: 'Xiaomi', logo: null, total: 43200 },
]

const sampleSellers: TopSellerGroup[] = [
  {
    seller_id: 1,
    shop_name: 'Baku Electronics Store',
    logo: null,
    products: sampleProducts,
  },
  {
    seller_id: 2,
    shop_name: 'iStore Official Partner',
    logo: null,
    products: [sampleProducts[0], sampleProducts[2]],
  },
  {
    seller_id: 3,
    shop_name: 'Tech Gadget Hub',
    logo: null,
    products: [sampleProducts[1], sampleProducts[3]],
  },
]

const sampleBrands: TopBrandGroup[] = [
  {
    brand_id: 1,
    brand_name: 'Apple',
    logo: null,
    products: [sampleProducts[0], sampleProducts[2]],
  },
  {
    brand_id: 2,
    brand_name: 'Samsung',
    logo: null,
    products: [sampleProducts[1]],
  },
  {
    brand_id: 3,
    brand_name: 'Sony',
    logo: null,
    products: [sampleProducts[3]],
  },
]

function makePeriodMap<T>(data: T): Record<RankingPeriod, T> {
  return {
    today: data,
    week: data,
    month: data,
    all: data,
  }
}

export const dashboardMock: DashboardStatsResponse = {
  kpis: {
    total_customers: 4820,
    top_customers: [
      { id: 1, name: 'Anar Əliyev' },
      { id: 2, name: 'Leyla Məmmədova' },
      { id: 3, name: 'Elvin Qasımov' },
      { id: 4, name: 'Aysel Kərimova' },
    ],
    total_products: 1450,
    total_inhouse_products: 320,
    total_sellers_products: 1130,
    total_categories: 48,
    top_categories: [
      { id: 1, name: 'Elektronika', total: 45200 },
      { id: 2, name: 'Geyim və Dəb', total: 28400 },
      { id: 3, name: 'Ev və Məişət', total: 19800 },
    ],
    total_brands: 96,
    top_brands: [
      { id: 1, name: 'Apple', total: 54100 },
      { id: 2, name: 'Samsung', total: 39500 },
      { id: 3, name: 'Xiaomi', total: 22800 },
    ],
    total_sale: 348250,
    sale_this_month: 42800,
    inhouse_sale_this_month: 16400,
    seller_sale_this_month: 26400,
    yearly_sales: [
      { month: 'Yan', total: 18500 },
      { month: 'Fev', total: 22400 },
      { month: 'Mar', total: 28900 },
      { month: 'Apr', total: 25100 },
      { month: 'May', total: 31200 },
      { month: 'İyn', total: 29800 },
      { month: 'İyl', total: 33400 },
      { month: 'Avq', total: 36200 },
      { month: 'Sen', total: 34500 },
      { month: 'Okt', total: 39800 },
      { month: 'Noy', total: 42800 },
      { month: 'Dek', total: 0 },
    ],
    total_sellers: 128,
    total_approved_sellers: 114,
    total_pending_sellers: 14,
    top_sellers: [
      { id: 1, name: 'Tech Baku' },
      { id: 2, name: 'Trend Moda' },
      { id: 3, name: 'Smart Life' },
      { id: 4, name: 'Elektro Planet' },
    ],
  },
  orders: {
    fulfillment_rate: 94.2,
    total_orders: 3840,
    inhouse_orders: 1420,
    inhouse_order_percentage: 37,
    seller_orders: 2420,
    seller_order_percentage: 63,
    pipeline: [
      {
        key: 'pending',
        label: 'Pending Order',
        count: 142,
        percentage: 12,
        color: '#F74396',
      },
      {
        key: 'confirmed',
        label: 'Confirmed Order',
        count: 210,
        percentage: 18,
        color: '#24BF85',
      },
      {
        key: 'processed',
        label: 'Order Processed',
        count: 95,
        percentage: 8,
        color: '#4E9FF4',
      },
      {
        key: 'shipped',
        label: 'Order Shipped',
        count: 320,
        percentage: 27,
        color: '#65D3E6',
      },
      {
        key: 'delivered',
        label: 'Order Delivered',
        count: 2840,
        percentage: 74,
        color: '#FFBB32',
      },
      {
        key: 'cancelled',
        label: 'Order Cancelled',
        count: 85,
        percentage: 7,
        color: '#F76464',
      },
    ],
  },
  inhouse_store: {
    fulfillment_rate: 96.5,
    total_sales: 148500,
    total_orders: 1420,
    total_products: 320,
    rating: 4.85,
    pipeline: [
      {
        key: 'pending',
        label: 'Pending Order',
        count: 42,
        percentage: 10,
        color: '#F74396',
      },
      {
        key: 'confirmed',
        label: 'Confirmed Order',
        count: 85,
        percentage: 20,
        color: '#24BF85',
      },
      {
        key: 'processed',
        label: 'Order Processed',
        count: 38,
        percentage: 9,
        color: '#4E9FF4',
      },
      {
        key: 'shipped',
        label: 'Order Shipped',
        count: 110,
        percentage: 26,
        color: '#65D3E6',
      },
      {
        key: 'delivered',
        label: 'Order Delivered',
        count: 1090,
        percentage: 77,
        color: '#FFBB32',
      },
      {
        key: 'cancelled',
        label: 'Order Cancelled',
        count: 55,
        percentage: 4,
        color: '#F76464',
      },
    ],
  },
  top_category_products: makePeriodMap(sampleCategories),
  inhouse_top_categories: makePeriodMap(sampleInhouseCategories),
  inhouse_top_brands: makePeriodMap(sampleInhouseBrands),
  top_sellers_products: makePeriodMap(sampleSellers),
  top_brands_products: makePeriodMap(sampleBrands),
}
