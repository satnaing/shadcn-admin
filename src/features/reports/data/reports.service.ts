import { api } from '@/config/api'
import { type WithPagination } from '@/shared/types'
import {
  type CommissionLogItem,
  type EarningReportItem,
  type ReportFilterParams,
  type ReportsOverview,
  type SaleReportItem,
  type StockReportItem,
  type UserSearchReportItem,
  type WalletHistoryItem,
  type WishlistReportItem,
} from './reports.type'

export const reportsService = {
  async getOverview(): Promise<{ data: ReportsOverview }> {
    return api.get('/admin/reports/overview')
  },

  async getEarnings(
    params?: ReportFilterParams
  ): Promise<WithPagination<EarningReportItem[]>> {
    return api.get('/admin/reports/earnings', { params })
  },

  async getInHouseSales(
    params?: ReportFilterParams
  ): Promise<WithPagination<SaleReportItem[]>> {
    return api.get('/admin/reports/in-house-sales', { params })
  },

  async getSellerSales(
    params?: ReportFilterParams
  ): Promise<WithPagination<SaleReportItem[]>> {
    return api.get('/admin/reports/seller-sales', { params })
  },

  async getStock(
    params?: ReportFilterParams
  ): Promise<WithPagination<StockReportItem[]>> {
    return api.get('/admin/reports/stock', { params })
  },

  async getWishlist(
    params?: ReportFilterParams
  ): Promise<WithPagination<WishlistReportItem[]>> {
    return api.get('/admin/reports/wishlist', { params })
  },

  async getUserSearches(
    params?: ReportFilterParams
  ): Promise<WithPagination<UserSearchReportItem[]>> {
    return api.get('/admin/reports/user-searches', { params })
  },

  async getCommissionLog(
    params?: ReportFilterParams
  ): Promise<WithPagination<CommissionLogItem[]>> {
    return api.get('/admin/reports/commission-log', { params })
  },

  async getWalletHistory(
    params?: ReportFilterParams
  ): Promise<WithPagination<WalletHistoryItem[]>> {
    return api.get('/admin/reports/wallet-history', { params })
  },
}
