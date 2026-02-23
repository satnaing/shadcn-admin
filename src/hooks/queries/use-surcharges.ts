import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createSurcharge,
  getSurcharges,
  toggleSurchargeStatus,
  updateSurcharge,
} from '@/services/surcharges'
import type { CreateSurchargeDto, UpdateSurchargeDto } from '@/types/api'

export const surchargesKeys = {
  all: ['surcharges'] as const,
  lists: () => [...surchargesKeys.all, 'list'] as const,
}

export function useSurcharges() {
  return useQuery({
    queryKey: surchargesKeys.lists(),
    queryFn: getSurcharges,
  })
}

export function useCreateSurcharge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSurchargeDto) => createSurcharge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surchargesKeys.lists() })
    },
  })
}

export function useUpdateSurcharge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSurchargeDto }) =>
      updateSurcharge(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surchargesKeys.lists() })
    },
  })
}

export function useToggleSurcharge() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => toggleSurchargeStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: surchargesKeys.lists() })
    },
  })
}
