import { type AdjustStockRequest, type PaginationMeta } from '@/types/api'
import {
  type UnitOfMeasure,
  type CreateUnitDto,
  type UpdateUnitDto,
  type Ingredient,
  type CreateIngredientDto,
  type UpdateIngredientDto,
  type Recipe,
  type CreateRecipeDto,
  type InventoryLogResponse,
  type ShopStockResponse,
} from '@/types/inventory'
import { apiClient } from '@/lib/api-client'

// Units of Measure
export const getUnits = async (
  params?: Record<string, unknown>
): Promise<{ data: UnitOfMeasure[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/uoms', { params })
  return {
    data: response.data?.items ?? response.data?.data ?? [],
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
    },
  }
}

export const createUnit = async (
  data: CreateUnitDto
): Promise<UnitOfMeasure> => {
  const response = await apiClient.post('/admin/uoms', data)
  return response.data
}

export const updateUnit = async (
  id: string,
  data: UpdateUnitDto
): Promise<UnitOfMeasure> => {
  const response = await apiClient.patch(`/admin/uoms/${id}`, data)
  return response.data
}

export const deleteUnit = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/uoms/${id}`)
}

// Ingredients
export const getIngredients = async (
  params?: Record<string, unknown>
): Promise<{ data: Ingredient[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/ingredients', { params })
  return {
    data: response.data?.items ?? response.data?.data ?? [],
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
    },
  }
}

export const createIngredient = async (
  data: CreateIngredientDto
): Promise<Ingredient> => {
  const response = await apiClient.post('/admin/ingredients', data)
  return response.data
}

export const updateIngredient = async (
  id: string,
  data: UpdateIngredientDto
): Promise<Ingredient> => {
  const response = await apiClient.patch(`/admin/ingredients/${id}`, data)
  return response.data
}

// Recipes
export const getRecipesByOptionId = async (
  optionId: string
): Promise<Recipe[]> => {
  const response = await apiClient.get(`/admin/recipes/option/${optionId}`)
  return response.data
}

export const createRecipe = async (data: CreateRecipeDto): Promise<Recipe> => {
  const response = await apiClient.post('/admin/recipes', data)
  return response.data
}

export const deleteRecipe = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/recipes/${id}`)
}

// Shop Inventory
export const getShopStock = async (
  shopId: string,
  params?: Record<string, string | number | boolean>
): Promise<ShopStockResponse> => {
  const response = await apiClient.get(`/admin/shops/${shopId}/inventory`, {
    params,
  })
  return {
    data: response.data?.items ?? response.data?.data ?? [],
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
    },
  }
}

export const getShopInventoryLogs = async (
  shopId: string,
  params?: Record<string, string | number | boolean>
): Promise<InventoryLogResponse> => {
  const response = await apiClient.get(
    `/admin/shops/${shopId}/inventory/logs`,
    {
      params,
    }
  )
  return {
    data: response.data?.items ?? response.data?.data ?? [],
    meta: {
      totalItems: response.data?.meta?.totalItems ?? 0,
      itemCount: response.data?.meta?.itemCount ?? 0,
      itemsPerPage: response.data?.meta?.itemsPerPage ?? 10,
      totalPages: response.data?.meta?.totalPages ?? 1,
      currentPage: response.data?.meta?.currentPage ?? 1,
    },
  }
}

export const adjustStock = async (
  shopId: string,
  data: AdjustStockRequest
): Promise<void> => {
  await apiClient.post(`/admin/shops/${shopId}/inventory/adjust`, data)
}

export const activateShopIngredients = async (shopId: string) => {
  const response = await apiClient.post(
    `/admin/shops/${shopId}/inventory/activate`
  )
  return response.data
}
