import { useQuery } from '@tanstack/react-query'
import { getActiveCarts } from '@/services/carts'

export function useActiveCarts(shopId?: string | null) {
  return useQuery({
    queryKey: ['active-carts', shopId],
    queryFn: () => getActiveCarts(shopId!),
    enabled: !!shopId,
    refetchInterval: 30000, // Refetch every 30 seconds for "real-time" monitoring
  })
}
