import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { classifiedService } from '../data/classified.service'
import {
  type ClassifiedFilterParams,
  type ClassifiedProductItem,
} from '../data/classified.type'

export function useClassifiedProducts(params?: ClassifiedFilterParams) {
  return useQuery({
    queryKey: ['admin-classified-products', params],
    queryFn: () => classifiedService.getProducts(params),
  })
}

export function useClassifiedMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-classified-products'] })
  }

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, is_published }: { id: number; is_published: boolean }) =>
      classifiedService.toggleStatus(id, is_published),
    onSuccess: invalidate,
  })

  const createMutation = useMutation({
    mutationFn: (data: Partial<ClassifiedProductItem>) =>
      classifiedService.createProduct(data),
    onSuccess: invalidate,
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number
      data: Partial<ClassifiedProductItem>
    }) => classifiedService.updateProduct(id, data),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => classifiedService.deleteProduct(id),
    onSuccess: invalidate,
  })

  return {
    toggleStatusMutation,
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
