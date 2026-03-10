import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPaymentMethod,
  getPaymentMethods,
  togglePaymentMethodStatus,
  updatePaymentMethod,
} from '@/services/payment-methods'
import type {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
} from '@/types/api'

export const paymentMethodsKeys = {
  all: ['payment-methods'] as const,
  lists: () => [...paymentMethodsKeys.all, 'list'] as const,
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: paymentMethodsKeys.lists(),
    queryFn: getPaymentMethods,
  })
}

export function useCreatePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePaymentMethodDto) => createPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodsKeys.lists() })
    },
  })
}

export function useUpdatePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentMethodDto }) =>
      updatePaymentMethod(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodsKeys.lists() })
    },
  })
}

export function useTogglePaymentMethod() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      togglePaymentMethodStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentMethodsKeys.lists() })
    },
  })
}
