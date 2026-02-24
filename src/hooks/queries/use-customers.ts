import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as customersService from '@/services/customers'
import type { CustomerStatus } from '@/types/growth'
import { toast } from 'sonner'

export const CUSTOMERS_QUERY_KEY = ['customers']

export function useCustomers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, params],
    queryFn: () => customersService.getCustomers(params),
  })
}

export function useUpdateCustomerStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: string
      status: CustomerStatus
      reason?: string
    }) => customersService.updateCustomerStatus(id, { status, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY })
      toast.success('Customer status updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update customer status: ' + error.message)
    },
  })
}
