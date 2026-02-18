import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getCategories,
  getProducts,
  updateCategory,
  updateProduct,
  getOptionGroups,
  getOptionGroup,
  createOptionGroup,
  updateOptionGroup,
  deleteOptionGroup,
  getCollections,
} from '@/services/catalog'
import type {
  CreateCategoryRequest,
  CreateProductRequest,
  ProductFilters,
  UpdateOptionGroupDto,
} from '@/types/api'

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
}

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: getCollections,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<CreateCategoryRequest>
    }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export const useOptionGroups = () => {
  return useQuery({
    queryKey: ['option-groups'],
    queryFn: getOptionGroups,
  })
}

export const useOptionGroup = (id: string) => {
  return useQuery({
    queryKey: ['option-group', id],
    queryFn: () => getOptionGroup(id),
    enabled: !!id,
  })
}

export const useCreateOptionGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createOptionGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['option-groups'] })
    },
  })
}

export const useUpdateOptionGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<UpdateOptionGroupDto>
    }) => updateOptionGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['option-groups'] })
    },
  })
}

export const useDeleteOptionGroup = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteOptionGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['option-groups'] })
    },
  })
}

// Products
export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<CreateProductRequest>
    }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
