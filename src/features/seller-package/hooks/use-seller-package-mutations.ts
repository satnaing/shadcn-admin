import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { sellerPackageApi } from '@/api/modules/seller-package.api'
import { sellerPackageKeys } from './use-seller-package'

/** Wraps a mutation: refetch the module queries on success and toast. */
function useAction<V>(fn: (v: V) => Promise<unknown>, toastKey: string) {
  const { t } = useTranslation('seller_package')
  const qc = useQueryClient()

  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sellerPackageKeys.all })
      toast.success(t(toastKey))
    },
    onError: () => toast.error(t('toast.error')),
  })
}

export function useSellerPackageMutations() {
  return {
    create: useAction(
      (values: unknown) => sellerPackageApi.create(values),
      'toast.created'
    ),
    update: useAction(
      (v: { id: number; values: unknown }) =>
        sellerPackageApi.update(v.id, v.values),
      'toast.updated'
    ),
    remove: useAction(
      (id: number) => sellerPackageApi.remove(id),
      'toast.deleted'
    ),
  }
}
