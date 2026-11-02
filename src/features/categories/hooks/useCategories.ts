import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriesKeys, categoriesService } from '../data/categories.service'
import type { CategoryFormData } from '../data/categories.type'

export function useCategories(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: categoriesKeys.list(params),
    queryFn: () => categoriesService.getList(params),
  })
}

export function useCategoryOptions() {
  return useQuery({
    queryKey: categoriesKeys.options(),
    queryFn: () => categoriesService.getAll(),
  })
}

export function useCategoryMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryFormData> }) =>
      categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.all })
    },
  })

  return {
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    deleteCategory: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
