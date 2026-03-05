import { type LocalizedText } from './api'

// Unit of Measure
export interface UnitOfMeasure {
  id: string
  name: LocalizedText
  symbol: LocalizedText
  type: string
  baseMultiplier: number
  businessId: string
  createdAt: string
  updatedAt: string
}

export interface CreateUnitDto {
  name: LocalizedText
  symbol: LocalizedText
  type: string
  baseMultiplier?: number
}

// Ingredient
export interface Ingredient {
  id: string
  name: LocalizedText | null
  sku: string
  cost: number | null
  unitId: string
  unit: UnitOfMeasure
  businessId: string
  createdAt: string
  updatedAt: string
}

export interface CreateIngredientDto {
  name: LocalizedText
  sku: string
  cost: number
  unitId: string
}

export type UpdateIngredientDto = Partial<CreateIngredientDto>

export type UpdateUnitDto = Partial<CreateUnitDto>

// Recipes
export interface Recipe {
  id: string
  productId: string | null
  optionId: string | null
  ingredientId: string
  ingredient?: Ingredient
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

// Shop Inventory
export interface ShopStockResponse {
  data: ShopIngredient[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ShopIngredient {
  shopIngredientId: string
  ingredientId: string
  name: LocalizedText
  sku: string
  unit: LocalizedText // unit is a LocalizedText object in the log
  unitSymbol: LocalizedText
  currentStock: number
  lowStockThreshold: number
  lastRestockedAt: string | null
  isLowStock?: boolean
  price?: number | null
}

export interface InventoryLog {
  id: string
  shopId: string
  ingredientId: string
  ingredient: {
    name: LocalizedText
    sku: string
    unit: {
      name: LocalizedText
      symbol: LocalizedText
    }
  }
  quantityChange: number
  reason: string // InventoryAdjustmentReason
  note?: string
  staffName?: string
  invoiceCode?: string
  createdAt: string
}

export interface InventoryLogResponse {
  data: InventoryLog[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
