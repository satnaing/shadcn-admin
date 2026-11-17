import { useQuery } from '@tanstack/react-query'
import { sellerPackageApi } from '@/api/modules/seller-package.api'

export const sellerPackageKeys = {
  all: ['SELLER_PACKAGE'] as const,
  list: () => [...sellerPackageKeys.all, 'list'] as const,
}

export const useSellerPackages = () =>
  useQuery({ queryKey: sellerPackageKeys.list(), queryFn: sellerPackageApi.list })
