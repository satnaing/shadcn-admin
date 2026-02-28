// Shared Types
export type LocalizedText = Record<string, string>

export interface PaginationMeta {
  itemCount: number
  totalItems: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

// Enums (from DB Spec)
export enum OrderStatus {
  ORDER_PLACED = 'ORDER_PLACED',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  PENDING_USER_ACTION = 'PENDING_USER_ACTION',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

export enum OptionType {
  VARIANT = 'VARIANT',
  MODIFIER = 'MODIFIER',
  ADDON = 'ADDON',
}

export enum InventoryAdjustmentReason {
  WASTE = 'WASTE',
  RESTOCK = 'RESTOCK',
  CORRECTION = 'CORRECTION',
  DAMAGE = 'DAMAGE',
}

export enum SurchargeType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

// DTOs (from API Spec)

// Auth
export interface StaffLoginRequest {
  username: string
  password: string
}

export type LoginResponse = StaffLoginResponse

export interface StaffLoginResponse {
  accessToken: string
  user: Staff
}

export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

// Catalog
export interface CreateCategoryRequest {
  name: LocalizedText
  slug: string
  description?: LocalizedText
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>

// Products
export interface CreateProductRequest {
  name: LocalizedText
  sku: string
  // basePrice removed, replaced by price structure
  categoryId: string
  description?: LocalizedText
  collectionIds?: string[]
  optionGroupIds?: string[]
  imageUrl?: LocalizedText
  // New fields
  price: ProductOptionGroup // The variant group for price
  priceGroupId: string
}

export interface Product {
  id: string
  name: LocalizedText
  sku: string
  price: ProductOptionGroup // Changed from number
  priceGroupId: string
  status: string // ProductStatus enum in DB spec
  categoryId: string
  category?: {
    id: string
    name: LocalizedText
    slug?: string
  }
  optionGroupIds?: string[] // M:N relationship
  imageUrl?: LocalizedText
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  status?: string
  collectionIds?: string[]
}

export interface ShopProduct {
  id: string
  shopId: string
  productId: string
  price: string
  isAvailable: boolean
  product: Product
}

// Recipes
export interface Recipe {
  id: string
  ingredientId: string
  productId?: string
  optionId?: string
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface CreateRecipeDto {
  ingredientId: string
  quantity: number
  productId?: string
  optionId?: string
}

// Option Groups
export interface OptionGroup {
  id: string
  name: LocalizedText
  type: OptionType
  sku: string
  minSelect: number
  maxSelect: number
  _count?: {
    products: number
    choices: number
  }
  choices?: OptionChoice[] // Returned in list view now
}

export interface OptionChoice {
  id?: string
  sku: string
  name: LocalizedText
  price: number
}

export type ProductOptionGroup = Omit<OptionGroup, 'id'> & { id?: string }

// Option Group DTOs
export interface CreateOptionChoiceDto {
  name: LocalizedText
  sku: string
  priceModifier?: number // Deprecated? The spec says priceModifier, but UI uses price.
  price?: number
  isDefault?: boolean
}

export type UpdateOptionChoiceDto = Partial<CreateOptionChoiceDto>

export interface CreateOptionGroupDto {
  name: LocalizedText
  sku: string
  type: OptionType
  minSelect: number
  maxSelect: number
  choices?: CreateOptionChoiceDto[]
}

export type UpdateOptionGroupDto = Partial<CreateOptionGroupDto>

export interface OrderCustomer {
  id: string
  name: string
  phone: string
  isGuest: boolean
}

export interface OrderFulfillment {
  category: string // 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'
  name: LocalizedText
}

export interface OrderPricing {
  subtotal: number
  discount: number
  surcharge: number
  grandTotal: number
}

// Orders
export interface Order {
  id: string
  invoiceCode: string
  queueNumber: number
  status: OrderStatus
  createdAt: string
  customer?: OrderCustomer
  fulfillment?: OrderFulfillment
  pricing: OrderPricing
  totalItems: number
  items: OrderItem[]

  paymentStatus?: PaymentStatus
  paymentMethodName?: LocalizedText
}

export interface OrderItemOption {
  name: string | LocalizedText
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderItem {
  id: string
  name: string | LocalizedText
  quantity: number
  unitPrice: number
  totalPrice: number
  options?: OrderItemOption[]
  notes?: string
}

// Keeping these just in case they are used elsewhere, though not in the prompt JSON
export interface OrderDiscount {
  id: string
  orderId: string
  promotionId: string
  name?: LocalizedText
  amount?: number
}

export interface OrderSurcharge {
  id: string
  orderId: string
  surchargeConfigId: string
  name?: LocalizedText
  amount?: number
  isTax?: boolean
}
export interface GetOrdersFilters {
  page?: number
  limit?: number
  shopId?: string
  status?: OrderStatus
  startDate?: string
  endDate?: string
  search?: string
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus
}

// Inventory / Ops
export interface InventoryItem {
  id: string
  ingredientId: string
  shopId: string
  currentStock: number
  lowStockThreshold: number
  ingredient: {
    id: string
    name: LocalizedText
    sku: string
    unitId: string
  }
}

export interface AdjustStockRequest {
  shopId: string
  ingredientId: string
  quantityChange: number
  reason: InventoryAdjustmentReason
  note?: string
}

// Staff
export interface Start {
  id: string
  username: string
  fullName: string
  globalRoleId?: string
}

export interface Shop {
  id: string
  name: LocalizedText
  code: string
  address?: string
  phone?: string
  description?: LocalizedText
  locationLat?: number | string
  locationLong?: number | string
  phoneContacts?: Record<string, string>
  openingHours?: Record<string, string>
  imageUrl?: string | LocalizedText
  bannerImageUrl?: string | LocalizedText
}

export interface Staff {
  id: string
  username: string
  fullName: string
  globalRoleId?: string // Optional global role
  shopId?: string // Optional current shop context (if applicable)
}

export interface CreateStaffRequest {
  username: string
  fullName: string
  password: string
  pin: string
  phone: string
  globalRoleId?: string
}

export interface AssignShopAccessRequest {
  shopId: string
  roleId?: string
}

export interface BusinessProfile {
  id: string
  name: LocalizedText
  supportEmail?: string
  logoUrl?: string
  bannerImageUrl?: LocalizedText // Spec says Json? for bannerImageUrl, likely Localized or string. Database spec says Json?. API spec says UpdateBusinessProfileDto bannerImageUrl is string. I'll use string | LocalizedText or just string based on API DTO. API DTO says string.
}

export interface UpdateBusinessProfileRequest {
  name?: LocalizedText
  supportEmail?: string
  logoUrl?: string
  bannerImageUrl?: string
}

// Surcharges
export interface SurchargeConfig {
  id: string
  businessId: string
  name: LocalizedText
  value: number
  type: SurchargeType
  isTax: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSurchargeDto {
  name: LocalizedText
  value: number
  type: SurchargeType
  isTax?: boolean
  isActive?: boolean
}

export type UpdateSurchargeDto = Partial<CreateSurchargeDto>
