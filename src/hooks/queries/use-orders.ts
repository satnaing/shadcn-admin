/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getOrders, updateOrderStatus, createOrder } from '@/services/ops'
import {
  type GetOrdersFilters,
  type OrderStatus,
  type CreateOrderRequest,
} from '@/types/api'
import { type KdsBoardState } from '@/types/kds'
import { printLabelViaBluetooth } from '@/utils/label-printer'
import { printReceiptViaBluetooth } from '@/utils/printer'
import { KDS_BOARD_KEYS } from './use-kds-board'

export const useOrders = (filters?: GetOrdersFilters) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrders(filters),
    refetchInterval: 30000, // Poll every 30s
  })
}

export const useCreateOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data),
    onSuccess: async (order: any) => {
      queryClient.invalidateQueries({ queryKey: KDS_BOARD_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ['orders'] })

      printReceiptViaBluetooth({
        invoiceCode: order.invoiceCode,
        createdAt: order.createdAt,
        fulfillmentCategory: order.fulfillmentCategory,
        queueNumber: order.queueNumber,
        subtotal: order.subtotal,
        total: order.grandTotal,
        paymentMethodName:
          typeof order.paymentMethodName === 'string'
            ? order.paymentMethodName
            : (order.paymentMethodName as Record<string, string>)?.en,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items: order.items.map((item: any) => ({
          id: item.id,
          name: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.subtotal,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          options: item.options?.map((opt: any) => ({
            name: opt.optionName,
            quantity: opt.quantity,
            unitPrice: opt.unitPrice,
            totalPrice: opt.subtotal,
          })),
          notes: item.instructions,
        })),
      })

      for (const item of order.items) {
        await printLabelViaBluetooth({
          drinkName:
            typeof item.productName === 'string'
              ? item.productName
              : item.productName?.en || '',
          note: item.instructions ?? undefined,
          orderCode: `YOK-${order.queueNumber}`,
          quantity: item.quantity,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          options: item.options?.map((opt: any) =>
            typeof opt.optionName === 'string'
              ? opt.optionName
              : opt.optionName?.en || ''
          ),
        })
      }
    },
  })
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      updateOrderStatus(id, { status }),
    onSuccess: async (_data, { id, status }) => {
      // 1. Update the local KDS board state
      const queryKeys = queryClient.getQueriesData<KdsBoardState>({
        queryKey: KDS_BOARD_KEYS.all,
      })

      queryKeys.forEach(([queryKey, oldData]) => {
        if (!oldData) return

        queryClient.setQueryData<KdsBoardState>(queryKey, (old) => {
          if (!old) return old
          const newState = { ...old }
          let foundOrder = null

          // Handle removing from origin column (or updating in place)
          Object.keys(newState).forEach((key) => {
            const statusCol = key as OrderStatus
            if (newState[statusCol]) {
              const orderIndex = newState[statusCol].findIndex(
                (o) => o.id === id
              )
              if (orderIndex !== -1) {
                foundOrder = { ...newState[statusCol][orderIndex], status }

                if (status === 'COMPLETED') {
                  // If complete, just update the status in place so it stays on screen
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  newState[statusCol][orderIndex] = foundOrder as any
                  foundOrder = null // Prevent it from being moved to a new destination column
                } else {
                  // Standard move: remove from current column
                  newState[statusCol] = newState[statusCol].filter(
                    (o) => o.id !== id
                  )
                }
              }
            }
          })

          // Add to destination column (if moving)
          if (foundOrder) {
            if (!newState[status]) {
              newState[status] = []
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            newState[status] = [foundOrder as any, ...newState[status]]
          }

          return newState
        })
      })

      // 2. Invalidate queries to sync with backend
      if (status === 'COMPLETED') {
        // Wait 3 seconds to let the user see the "Completed" state before the board refetches and clears it
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: KDS_BOARD_KEYS.all })
          queryClient.invalidateQueries({ queryKey: ['orders'] })
        }, 3000)
      } else {
        queryClient.invalidateQueries({ queryKey: ['orders'] })
        queryClient.invalidateQueries({ queryKey: KDS_BOARD_KEYS.all })
      }
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: KDS_BOARD_KEYS.all })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
