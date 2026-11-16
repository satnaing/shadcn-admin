import { Link } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionGuard } from '@/components/guard'
import { PreorderProductsTable } from './preorder-products-table'
import { PreorderTabs } from './preorder-tabs'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

const OWNERS = ['all', 'inhouse', 'seller'] as const

export function PreorderProductsPage({ search, navigate }: Props) {
  const { t } = useTranslation('preorder')

  return (
    <AdminPageShell
      title={t('products.title')}
      description={t('products.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.PREORDER.PRODUCTS_MANAGE}>
          <Button asChild>
            <Link to='/admin/preorder/products/new'>
              <Plus className='me-2 size-4' />
              {t('products.new')}
            </Link>
          </Button>
        </PermissionGuard>
      }
    >
      <PreorderTabs
        param='owner'
        items={OWNERS}
        labelKey='products.owner'
        search={search}
        navigate={navigate}
      />
      <PreorderProductsTable search={search} navigate={navigate} />
    </AdminPageShell>
  )
}
