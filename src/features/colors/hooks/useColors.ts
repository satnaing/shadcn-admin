import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { colorsKeys, colorsService } from '../data/colors.service'
import type { ColorFormData } from '../data/colors.type'

export function useColors(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: colorsKeys.list(params),
    queryFn: () => colorsService.getList(params),
  })
}

export function useColorMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: ColorFormData) => colorsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: colorsKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ColorFormData> }) =>
      colorsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: colorsKeys.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => colorsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: colorsKeys.all })
    },
  })

  return {
    createColor: createMutation.mutateAsync,
    updateColor: updateMutation.mutateAsync,
    deleteColor: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
