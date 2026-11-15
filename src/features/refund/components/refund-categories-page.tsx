import { Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { useRefundSettings } from '../hooks/use-refund'
import { RefundCategoriesTable } from './refund-categories-table'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Refund period per category (applies to its sub-categories too); only used when the refund type is "category". */
export function RefundCategoriesPage({ search, navigate }: Props) {
  const { t } = useTranslation('refund')
  const { data } = useRefundSettings()

  return (
    <AdminPageShell title={t('categories.title')} description={t('categories.description')}>
      {data && data.data.refund_type !== 'category' && (
        <Alert>
          <Info className='size-4' />
          <AlertDescription>{t('categories.inactiveNotice')}</AlertDescription>
        </Alert>
      )}
      <RefundCategoriesTable search={search} navigate={navigate} />
    </AdminPageShell>
  )
}
