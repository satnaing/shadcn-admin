import { useQuery } from '@tanstack/react-query'
import { sellersService } from '../data/sellers.service'
import { type SellerFilterParams } from '../data/sellers.type'

export function useSellers(params?: SellerFilterParams) {
  return useQuery({
    queryKey: ['admin-sellers', params],
    queryFn: () => sellersService.getSellers(params),
  })
}

export function usePayoutRequests(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ['admin-payout-requests', params],
    queryFn: () => sellersService.getPayoutRequests(params),
  })
}

export function useSellerCommissions() {
  return useQuery({
    queryKey: ['admin-seller-commissions'],
    queryFn: () => sellersService.getCommissions(),
  })
}

export function useSellerPackages() {
  return useQuery({
    queryKey: ['admin-seller-packages'],
    queryFn: () => sellersService.getPackages(),
  })
}

export function useVerificationFields() {
  return useQuery({
    queryKey: ['admin-seller-verification-fields'],
    queryFn: () => sellersService.getVerificationFields(),
  })
}

export { useSellerMutations } from './useSellerMutations'
