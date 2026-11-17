import { useState } from 'react'
import { PERMISSIONS } from '@/shared/permissions'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PermissionGuard } from '@/components/guard'
import type { SellerPackage } from '../data/seller-package.type'
import { useSellerPackages } from '../hooks/use-seller-package'
import { useSellerPackageMutations } from '../hooks/use-seller-package-mutations'
import { SellerPackageCard } from './seller-package-card'
import { SellerPackageDialog } from './seller-package-dialog'

/** Subscription packages sellers buy (offline payment requests live in Payments). */
export function SellerPackagesPage() {
  const { t } = useTranslation('seller_package')
  const { data } = useSellerPackages()
  const packages = data?.data ?? []
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<SellerPackage | null>(null)
  const [removing, setRemoving] = useState<SellerPackage | null>(null)
  const { remove } = useSellerPackageMutations()

  return (
    <AdminPageShell
      title={t('title')}
      description={t('description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.SELLER_PACKAGE.CREATE}>
          <Button onClick={() => setCreating(true)}>
            <Plus className='me-2 size-4' />
            {t('new')}
          </Button>
        </PermissionGuard>
      }
    >
      {packages.length === 0 ? (
        <p className='text-muted-foreground'>{t('empty')}</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {packages.map((p) => (
            <SellerPackageCard
              key={p.id}
              pack={p}
              onEdit={setEditing}
              onDelete={setRemoving}
            />
          ))}
        </div>
      )}
      {creating && (
        <SellerPackageDialog
          open
          onOpenChange={(open) => !open && setCreating(false)}
        />
      )}
      {editing && (
        <SellerPackageDialog
          key={editing.id}
          open
          onOpenChange={(open) => !open && setEditing(null)}
          pack={editing}
        />
      )}
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('deleteTitle')}
        desc={t('deleteDesc', { name: removing?.name })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={remove.isPending}
        handleConfirm={() =>
          removing &&
          remove.mutate(removing.id, { onSettled: () => setRemoving(null) })
        }
      />
    </AdminPageShell>
  )
}
