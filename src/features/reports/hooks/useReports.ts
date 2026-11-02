import { useQuery } from '@tanstack/react-query'
import { reportsService } from '../data/reports.service'
import { type ReportFilterParams } from '../data/reports.type'

export function useReportsOverview() {
  return useQuery({
    queryKey: ['reports-overview'],
    queryFn: () => reportsService.getOverview(),
  })
}

export function useEarningReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports-earnings', params],
    queryFn: () => reportsService.getEarnings(params),
  })
}

export function useInHouseSalesReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports-in-house-sales', params],
    queryFn: () => reportsService.getInHouseSales(params),
  })
}

export function useSellerSalesReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports-seller-sales', params],
    queryFn: () => reportsService.getSellerSales(params),
  })
}

export function useStockReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports-stock', params],
    queryFn: () => reportsService.getStock(params),
  })
}

export function useWishlistReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports-wishlist', params],
    queryFn: () => reportsService.getWishlist(params),
  })
}

export function useUserSearchesReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports-user-searches', params],
    queryFn: () => reportsService.getUserSearches(params),
  })
}

export function useCommissionLogReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports-commission-log', params],
    queryFn: () => reportsService.getCommissionLog(params),
  })
}

export function useWalletHistoryReport(params?: ReportFilterParams) {
  return useQuery({
    queryKey: ['reports-wallet-history', params],
    queryFn: () => reportsService.getWalletHistory(params),
  })
}
