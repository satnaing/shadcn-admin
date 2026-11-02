import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { unitsKeys, unitsService } from '../data/units.service'
import type { UnitFormData } from '../data/units.type'

export function useUnits(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: unitsKeys.list(params),
    queryFn: () => unitsService.getList(params),
  })
}

export function useUnitMutations() {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: UnitFormData) => unitsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UnitFormData> }) =>
      unitsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => unitsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitsKeys.all })
    },
  })

  return {
    createUnit: createMutation.mutateAsync,
    updateUnit: updateMutation.mutateAsync,
    deleteUnit: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
