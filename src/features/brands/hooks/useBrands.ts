import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { brandsKeys, brandsService } from '../data/brands.service'
import type { BrandFormData } from '../data/brands.type'

export function useBrands(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: brandsKeys.list(params),
    queryFn: () => brandsService.getList(params),
  })
}

export function useBrandMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: BrandFormData) => brandsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandsKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BrandFormData> }) =>
      brandsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandsKeys.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => brandsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brandsKeys.all })
    },
  })

  return {
    createBrand: createMutation.mutateAsync,
    updateBrand: updateMutation.mutateAsync,
    deleteBrand: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
