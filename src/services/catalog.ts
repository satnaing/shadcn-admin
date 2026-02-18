import {
  type Product,
  type CreateProductRequest,
  type CreateCategoryRequest,
  type ProductFilters,
  type CreateOptionGroupDto,
  type UpdateOptionGroupDto,
  // Update types if needed
} from '@/types/api'
import { apiClient } from '@/lib/api-client'

// Categories
export const getCategories = async () => {
  const response = await apiClient.get('/admin/categories')
  return response.data
}

// Collections
export const getCollections = async () => {
  const response = await apiClient.get('/admin/collections')
  return response.data
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
export const getOptionGroups = async () => {
  const response = await apiClient.get('/admin/option-groups')
  return response.data
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
export const getProducts = async (filters?: ProductFilters) => {
  const response = await apiClient.get('/admin/products', { params: filters })
  return response.data
}

export const createProduct = async (
  data: CreateProductRequest
): Promise<Product> => {
  console.log('Payload: ', data)
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
