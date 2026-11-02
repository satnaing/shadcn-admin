import { requestInstanceClient } from '@/config/api'
import { type WithPagination } from '@/shared/types'
import {
  type CommissionRuleItem,
  type PayoutRequestItem,
  type SellerFilterParams,
  type SellerItem,
  type SellerPackageItem,
  type VerificationFieldItem,
} from './sellers.type'

export const sellersService = {
  getSellers(params?: SellerFilterParams) {
    return requestInstanceClient.get<WithPagination<SellerItem[]>>('/admin/sellers', { params })
  },
  getSellerById(id: number | string) {
    return requestInstanceClient.get<{ data: SellerItem }>(`/admin/sellers/${id}`)
  },
  toggleApproval(id: number | string, is_approved: boolean) {
    return requestInstanceClient.patch(`/admin/sellers/${id}/approval`, { is_approved })
  },
  toggleBan(id: number | string, is_banned: boolean) {
    return requestInstanceClient.patch(`/admin/sellers/${id}/ban`, { is_banned })
  },
  paySeller(id: number | string, payload: { amount: number; payment_method: string; note?: string }) {
    return requestInstanceClient.post(`/admin/sellers/${id}/pay`, payload)
  },
  getPayoutRequests(params?: { status?: string; page?: number }) {
    return requestInstanceClient.get<WithPagination<PayoutRequestItem[]>>('/admin/sellers/payout-requests', { params })
  },
  updatePayoutStatus(id: number | string, status: 'paid' | 'rejected') {
    return requestInstanceClient.patch(`/admin/sellers/payout-requests/${id}/status`, { status })
  },
  getCommissions() {
    return requestInstanceClient.get<{ data: CommissionRuleItem[] }>('/admin/sellers/commissions')
  },
  saveCommission(payload: Partial<CommissionRuleItem>) {
    return payload.id
      ? requestInstanceClient.put(`/admin/sellers/commissions/${payload.id}`, payload)
      : requestInstanceClient.post('/admin/sellers/commissions', payload)
  },
  deleteCommission(id: number | string) {
    return requestInstanceClient.delete(`/admin/sellers/commissions/${id}`)
  },
  getPackages() {
    return requestInstanceClient.get<{ data: SellerPackageItem[] }>('/admin/sellers/packages')
  },
  savePackage(payload: Partial<SellerPackageItem>) {
    return payload.id
      ? requestInstanceClient.put(`/admin/sellers/packages/${payload.id}`, payload)
      : requestInstanceClient.post('/admin/sellers/packages', payload)
  },
  deletePackage(id: number | string) {
    return requestInstanceClient.delete(`/admin/sellers/packages/${id}`)
  },
  getVerificationFields() {
    return requestInstanceClient.get<{ data: VerificationFieldItem[] }>('/admin/sellers/verification-form')
  },
  saveVerificationFields(fields: VerificationFieldItem[]) {
    return requestInstanceClient.post('/admin/sellers/verification-form', { fields })
  },
}
