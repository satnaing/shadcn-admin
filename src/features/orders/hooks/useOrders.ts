import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ordersService } from '../data/orders.service'
import {
  type DeliveryStatus,
  type OrderFilterParams,
  type PaymentStatus,
} from '../data/orders.type'

export function useOrders(params?: OrderFilterParams) {
  return useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => ordersService.getList(params),
  })
}

export function useOrderDetail(id: number | string) {
  return useQuery({
    queryKey: ['admin-order-detail', id],
    queryFn: () => ordersService.getById(id),
    enabled: Boolean(id),
  })
}

export function useOrderMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-order-detail'] })
  }

  const deliveryMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number | string
      status: DeliveryStatus
    }) => ordersService.updateDeliveryStatus(id, status),
    onSuccess: invalidate,
  })

  const paymentMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number | string
      status: PaymentStatus
    }) => ordersService.updatePaymentStatus(id, status),
    onSuccess: invalidate,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => ordersService.delete(id),
    onSuccess: invalidate,
  })

  return {
    deliveryMutation,
    paymentMutation,
    deleteMutation,
  }
}
