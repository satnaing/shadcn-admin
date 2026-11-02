import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productsKeys, productsService } from '../data/products.service'

export function useProductReviews(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: productsKeys.reviews(params),
    queryFn: () => productsService.getReviews(params),
  })
}

export function useProductReviewMutations() {
  const queryClient = useQueryClient()

  const toggleStatus = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      productsService.updateReviewStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.reviews() })
    },
  })

  const deleteReview = useMutation({
    mutationFn: (id: number) => productsService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsKeys.reviews() })
    },
  })

  return {
    toggleReviewStatus: toggleStatus.mutateAsync,
    deleteReview: deleteReview.mutateAsync,
  }
}
