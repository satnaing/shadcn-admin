import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// --- Inventory Management (Full Control) ---

import {
  createIngredient,
  createUnit,
  getIngredients,
  getUnits,
  updateIngredient,
  updateUnit,
  deleteUnit,
  getShopStock,
  adjustStock,
  activateShopIngredients,
  getShopInventoryLogs,
} from '@/services/inventory'
// import { getInventory, adjustStock } from '@/services/ops' // Deprecated?
import { type AdjustStockRequest } from '@/types/api'
import {
  type CreateIngredientDto,
  type CreateUnitDto,
  type UpdateIngredientDto,
  type UpdateUnitDto,
} from '@/types/inventory'

export const useShopStock = (
  shopId: string,
  params?: Record<string, string | number | boolean>
) => {
  return useQuery({
    queryKey: ['shop-inventory', shopId, params],
    queryFn: () => getShopStock(shopId, params),
    enabled: !!shopId,
  })
}

export const useShopInventoryLogs = (
  shopId: string,
  params?: Record<string, string | number | boolean>
) => {
  return useQuery({
    queryKey: ['shop-inventory-logs', shopId, params],
    queryFn: () => getShopInventoryLogs(shopId, params),
    enabled: !!shopId,
  })
}

export const useAdjustStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      shopId,
      data,
    }: {
      shopId: string
      data: AdjustStockRequest
    }) => adjustStock(shopId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shop-inventory', variables.shopId],
      })
    },
  })
}

export const useActivateShopIngredients = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (shopId: string) => activateShopIngredients(shopId),
    onSuccess: (_, shopId) => {
      queryClient.invalidateQueries({ queryKey: ['shop-inventory', shopId] })
    },
  })
}

// Units
export const useUnits = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['units', params],
    queryFn: () => getUnits(params),
  })
}

export const useCreateUnit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateUnitDto) => createUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
    },
  })
}

export const useUpdateUnit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUnitDto }) =>
      updateUnit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
    },
  })
}

export const useDeleteUnit = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUnit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
    },
  })
}

// Ingredients
export const useIngredients = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['ingredients', params],
    queryFn: () => getIngredients(params),
  })
}

export const useCreateIngredient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateIngredientDto) => createIngredient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}

export const useUpdateIngredient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIngredientDto }) =>
      updateIngredient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}
