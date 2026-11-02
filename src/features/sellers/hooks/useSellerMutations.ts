import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sellersService } from '../data/sellers.service'
import {
  type CommissionRuleItem,
  type SellerPackageItem,
  type VerificationFieldItem,
} from '../data/sellers.type'
export function useSellerMutations() {
  const queryClient = useQueryClient()
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin-sellers'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-payout-requests'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-seller-commissions'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-seller-packages'] })
    void queryClient.invalidateQueries({ queryKey: ['admin-seller-verification-fields'] })
  }
  const approvalMutation = useMutation({
    mutationFn: ({ id, is_approved }: { id: number; is_approved: boolean }) =>
      sellersService.toggleApproval(id, is_approved),
    onSuccess: invalidate,
  })
  const banMutation = useMutation({
    mutationFn: ({ id, is_banned }: { id: number; is_banned: boolean }) =>
      sellersService.toggleBan(id, is_banned),
    onSuccess: invalidate,
  })
  const payMutation = useMutation({
    mutationFn: ({ id, amount, payment_method, note }: { id: number; amount: number; payment_method: string; note?: string }) =>
      sellersService.paySeller(id, { amount, payment_method, note }),
    onSuccess: invalidate,
  })
  const payoutStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'paid' | 'rejected' }) =>
      sellersService.updatePayoutStatus(id, status),
    onSuccess: invalidate,
  })
  const commissionMutation = useMutation({
    mutationFn: (p: Partial<CommissionRuleItem>) => sellersService.saveCommission(p),
    onSuccess: invalidate,
  })
  const deleteCommissionMutation = useMutation({
    mutationFn: (id: number) => sellersService.deleteCommission(id),
    onSuccess: invalidate,
  })
  const packageMutation = useMutation({
    mutationFn: (p: Partial<SellerPackageItem>) => sellersService.savePackage(p),
    onSuccess: invalidate,
  })
  const deletePackageMutation = useMutation({
    mutationFn: (id: number) => sellersService.deletePackage(id),
    onSuccess: invalidate,
  })
  const verificationMutation = useMutation({
    mutationFn: (f: VerificationFieldItem[]) => sellersService.saveVerificationFields(f),
    onSuccess: invalidate,
  })
  return {
    approvalMutation,
    banMutation,
    payMutation,
    payoutStatusMutation,
    commissionMutation,
    deleteCommissionMutation,
    packageMutation,
    deletePackageMutation,
    verificationMutation,
  }
}
