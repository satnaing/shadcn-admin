import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productsKeys, productsService } from '../data/products.service'
import type { ProductFormData } from '../data/products.type'

export function useProducts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: productsKeys.list(params),
    queryFn: () => productsService.getList(params),
  })
}

export function useProductDetail(id: number) {
  return useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => productsService.getById(id),
    enabled: id > 0,
  })
}

export function useProductMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductFormData> }) =>
      productsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      field,
      value,
    }: {
      id: number
      field: 'published' | 'featured' | 'todays_deal' | 'approved'
      value: boolean
    }) => productsService.updateStatus(id, field, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.all })
    },
  })

  return {
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    deleteProduct: deleteMutation.mutateAsync,
    toggleStatus: statusMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
