import { Link } from '@tanstack/react-router'
import { PERMISSIONS } from '@/shared/permissions'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { PermissionGuard } from '@/components/guard'
import { useOwnerTabs } from '../hooks/use-owner-tabs'
import { WholesaleOwnerTabs } from './wholesale-owner-tabs'
import { WholesaleProductsTable } from './wholesale-products-table'

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** All / in-house / seller wholesale products (AEC had three list screens); one server-filtered list here. */
export function WholesaleProductsPage({ search, navigate }: Props) {
  const { t } = useTranslation('wholesale')
  const { tabs, active } = useOwnerTabs(search)

  return (
    <AdminPageShell
      title={t('products.title')}
      description={t('products.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.WHOLESALE.CREATE}>
          <Button asChild>
            <Link to='/admin/wholesale/new'>
              <Plus className='me-2 size-4' />
              {t('products.new')}
            </Link>
          </Button>
        </PermissionGuard>
      }
    >
      <WholesaleOwnerTabs tabs={tabs} active={active} navigate={navigate} />
      <WholesaleProductsTable
        owner={active}
        search={search}
        navigate={navigate}
      />
    </AdminPageShell>
  )
}
