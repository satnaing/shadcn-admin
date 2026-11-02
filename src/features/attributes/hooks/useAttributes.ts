import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { attributesKeys, attributesService } from '../data/attributes.service'
import type { AttributeFormData } from '../data/attributes.type'

export function useAttributes(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: attributesKeys.list(params),
    queryFn: () => attributesService.getList(params),
  })
}

export function useAttributeMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: AttributeFormData) => attributesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributesKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AttributeFormData> }) =>
      attributesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributesKeys.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => attributesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attributesKeys.all })
    },
  })

  return {
    createAttribute: createMutation.mutateAsync,
    updateAttribute: updateMutation.mutateAsync,
    deleteAttribute: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
