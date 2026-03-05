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
  getShopProducts,
  syncShopCatalog,
  toggleBulkProductAvailability,
  updateShopProduct,
  updateShopOptionChoice,
} from '@/services/catalog'
import type {
  CreateCategoryRequest,
  CreateProductRequest,
  ProductFilters,
  UpdateOptionGroupDto,
} from '@/types/api'

// Categories
export const useCategories = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
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

export const useOptionGroups = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['option-groups', params],
    queryFn: () => getOptionGroups(params),
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

// Shop Menu
export const useShopProducts = (shopId: string) => {
  return useQuery({
    queryKey: ['shop-products', shopId],
    queryFn: () => getShopProducts(shopId),
    enabled: !!shopId,
  })
}

export const useSyncShopCatalog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shopId: string) => syncShopCatalog(shopId),
    onSuccess: (_, shopId) => {
      queryClient.invalidateQueries({
        queryKey: ['shop-products', shopId],
      })
    },
  })
}

export const useToggleProductAvailability = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      shopId,
      productId,
      isAvailable,
    }: {
      shopId: string
      productId: string
      isAvailable: boolean
    }) => updateShopProduct(shopId, productId, { isAvailable }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shop-products', variables.shopId],
      })
    },
  })
}

export const useToggleBulkProductAvailability = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      shopId,
      productIds,
      status,
    }: {
      shopId: string
      productIds: string[]
      status: boolean
    }) => toggleBulkProductAvailability(shopId, productIds, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shop-products', variables.shopId],
      })
    },
  })
}

export const useUpdateShopProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      shopId,
      productId,
      data,
    }: {
      shopId: string
      productId: string
      data: { price?: number; isAvailable?: boolean; badgeIds?: string[] }
    }) => updateShopProduct(shopId, productId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shop-products', variables.shopId],
      })
    },
  })
}

export const useUpdateShopOptionChoice = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      shopId,
      choiceId,
      data,
    }: {
      shopId: string
      choiceId: string
      data: { price?: number; isAvailable?: boolean; badgeIds?: string[] }
    }) => updateShopOptionChoice(shopId, choiceId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shop-products', variables.shopId],
      })
    },
  })
}
