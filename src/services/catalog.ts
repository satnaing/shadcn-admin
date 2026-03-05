import {
  type Product,
  type CreateProductRequest,
  type CreateCategoryRequest,
  type ProductFilters,
  type CreateOptionGroupDto,
  type UpdateOptionGroupDto,
  type PaginationMeta,
  type Category,
  type OptionGroup,
} from '@/types/api'
import { apiClient } from '@/lib/api-client'

// Categories
export const getCategories = async (
  params?: Record<string, unknown>
): Promise<{ data: Category[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/categories', { params })
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

// Collections
export const getCollections = async () => {
  const response = await apiClient.get('/admin/collections')
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

export const createCategory = async (data: CreateCategoryRequest) => {
  const response = await apiClient.post('/admin/categories', data)
  return response.data
}

export const updateCategory = async (
  id: string,
  data: Partial<CreateCategoryRequest>
) => {
  const response = await apiClient.patch(`/admin/categories/${id}`, data)
  return response.data
}

export const deleteCategory = async (id: string) => {
  const response = await apiClient.delete(`/admin/categories/${id}`)
  return response.data
}

// Option Groups
export const getOptionGroups = async (
  params?: Record<string, unknown>
): Promise<{ data: OptionGroup[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/option-groups', { params })
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

export const getOptionGroup = async (id: string) => {
  const response = await apiClient.get(`/admin/option-groups/${id}`)
  return response.data
}

export const createOptionGroup = async (data: CreateOptionGroupDto) => {
  // eslint-disable-next-line no-console
  console.log('API createOptionGroup payload:', data)
  const response = await apiClient.post('/admin/option-groups', data)
  return response.data
}

export const updateOptionGroup = async (
  id: string,
  data: UpdateOptionGroupDto
) => {
  // eslint-disable-next-line no-console
  console.log('API updateOptionGroup payload:', { id, data })
  const response = await apiClient.patch(`/admin/option-groups/${id}`, data)
  return response.data
}

export const deleteOptionGroup = async (id: string) => {
  const response = await apiClient.delete(`/admin/option-groups/${id}`)
  return response.data
}

// Products
export const getProducts = async (
  filters?: ProductFilters
): Promise<{ data: Product[]; meta: PaginationMeta }> => {
  const response = await apiClient.get('/admin/products', { params: filters })
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

export const createProduct = async (
  data: CreateProductRequest
): Promise<Product> => {
  const response = await apiClient.post('/admin/products', data)
  return response.data
}

export const updateProduct = async (
  id: string,
  data: Partial<CreateProductRequest>
): Promise<Product> => {
  const response = await apiClient.patch(`/admin/products/${id}`, data)
  return response.data
}

export const deleteProduct = async (id: string) => {
  const response = await apiClient.delete(`/admin/products/${id}`)
  return response.data
}

// Shop Menu
export const getShopProducts = async (shopId: string) => {
  const response = await apiClient.get(`/admin/shops/${shopId}/menu`)
  return response.data
}

export const syncShopCatalog = async (shopId: string) => {
  const response = await apiClient.post(
    `/admin/shops/${shopId}/sync-catalog`,
    {}
  )
  return response.data
}

export const toggleProductAvailability = async (
  shopId: string,
  productId: string,
  isAvailable: boolean
) => {
  const response = await apiClient.patch(
    `/admin/shops/${shopId}/menu/products/${productId}`,
    { isAvailable }
  )
  return response.data
}

export const toggleBulkProductAvailability = async (
  shopId: string,
  productIds: string[],
  status: boolean
) => {
  const response = await apiClient.patch(`/admin/shops/${shopId}/menu/status`, {
    productIds,
    status,
  })
  return response.data
}

export const updateShopProduct = async (
  shopId: string,
  productId: string,
  data: { price?: number; isAvailable?: boolean; badgeIds?: string[] }
) => {
  const response = await apiClient.patch(
    `/admin/shops/${shopId}/menu/products/${productId}`,
    data
  )
  return response.data
}

export const updateShopOptionChoice = async (
  shopId: string,
  choiceId: string,
  data: { price?: number; isAvailable?: boolean; badgeIds?: string[] }
) => {
  const response = await apiClient.patch(
    `/admin/shops/${shopId}/menu/choices/${choiceId}`,
    data
  )
  return response.data
}
