import { useState } from 'react'
import { PackagePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PERMISSIONS } from '@/shared/permissions'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionGuard } from '@/components/guard'
import { Button } from '@/components/ui/button'
import { PosImportDialog } from './pos-import-dialog'
import { PosProductsTable } from './pos-products-table'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function PosProductsPage({ search, navigate }: Props) {
  const { t } = useTranslation('pos')
  const [importing, setImporting] = useState(false)

  return (
    <AdminPageShell
      title={t('products.title')}
      description={t('products.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.POS.PRODUCTS_MANAGE}>
          <Button onClick={() => setImporting(true)}>
            <PackagePlus className='me-2 size-4' />
            {t('products.import')}
          </Button>
        </PermissionGuard>
      }
    >
      <PosProductsTable search={search} navigate={navigate} />
      <PosImportDialog open={importing} onOpenChange={setImporting} />
    </AdminPageShell>
  )
}
