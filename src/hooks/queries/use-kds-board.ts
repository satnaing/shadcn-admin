import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getKdsOrders } from '@/services/ops'
import { type OrderStatus } from '@/types/api'
import { type KdsBoardState, type KdsOrder } from '@/types/kds'
import { io } from 'socket.io-client'

export const KDS_BOARD_KEYS = {
  all: ['kds-board'] as const,
  shop: (shopId: string | undefined) =>
    [...KDS_BOARD_KEYS.all, shopId] as const,
}

export function useKdsBoard(
  shopId: string | undefined,
  autoRefresh: boolean = true
) {
  const queryClient = useQueryClient()

  // 1. Initial Fetch via React Query
  const query = useQuery({
    queryKey: KDS_BOARD_KEYS.shop(shopId),
    queryFn: () => getKdsOrders(shopId as string),
    enabled: !!shopId,
    // The socket will keep this fresh, but a background refetch is good
    refetchInterval: autoRefresh ? 30000 : false, // Poll every 30s if enabled
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // 2. Real-time WebSocket Subscription
  useEffect(() => {
    if (!shopId) return

    // Connect to the specific namespace and send shopId as query
    const socket = io(`${import.meta.env.VITE_API_URL}/kds`, {
      query: {
        shopId,
      },
      transports: ['websocket'],
    })

    socket.on('connect', () => {
      // eslint-disable-next-line no-console
      console.log('Connected to KDS Real-time Gateway for Shop:', shopId)
    })

    // Listen for new orders
    socket.on('order.created', (newOrder: KdsOrder) => {
      queryClient.setQueryData<KdsBoardState>(
        KDS_BOARD_KEYS.shop(shopId),
        (oldData) => {
          if (!oldData) return oldData

          // Deep clone the old state to avoid mutating React Query cache directly
          const newState = { ...oldData }
          const status = newOrder.status as OrderStatus

          // Initialize array if it doesn't exist
          if (!newState[status]) {
            newState[status] = []
          }

          // Prepend the new order to the top of the column
          newState[status] = [newOrder, ...newState[status]]

          return newState
        }
      )
    })

    // Listen for order cancellations (or other removals)
    socket.on('order.cancelled', (cancelledOrder: { id: string }) => {
      queryClient.setQueryData<KdsBoardState>(
        KDS_BOARD_KEYS.shop(shopId),
        (oldData) => {
          if (!oldData) return oldData

          const newState = { ...oldData }

          // Remove the order from ALL columns where it might exist
          Object.keys(newState).forEach((key) => {
            const statusCol = key as OrderStatus
            if (newState[statusCol]) {
              newState[statusCol] = newState[statusCol].filter(
                (o) => o.id !== cancelledOrder.id
              )
            }
          })

          return newState
        }
      )
    })

    return () => {
      socket.disconnect()
    }
  }, [shopId, queryClient])

  return query
}
