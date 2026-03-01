import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getShops,
  getShop,
  updateShop,
  getShopFulfillmentMethods,
} from '@/services/shops'

export const shopsKeys = {
  all: ['shops'] as const,
  lists: () => [...shopsKeys.all, 'list'] as const,
  list: (filters: string) => [...shopsKeys.lists(), { filters }] as const,
  details: () => [...shopsKeys.all, 'detail'] as const,
  detail: (id: string) => [...shopsKeys.details(), id] as const,
}

export function useShops() {
  return useQuery({
    queryKey: shopsKeys.lists(),
    queryFn: getShops,
  })
}

export function useShop(id: string) {
  return useQuery({
    queryKey: shopsKeys.detail(id),
    queryFn: () => getShop(id),
    enabled: !!id,
  })
}

export function useUpdateShop() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateShop(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shopsKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: shopsKeys.detail(variables.id),
      })
    },
  })
}

export function useShopFulfillmentMethods(id: string | undefined) {
  return useQuery({
    queryKey: [...shopsKeys.detail(id || ''), 'fulfillment-methods'],
    queryFn: () => getShopFulfillmentMethods(id as string),
    enabled: !!id,
  })
}
