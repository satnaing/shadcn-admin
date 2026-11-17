import { useState } from 'react'
import { PERMISSIONS } from '@/shared/permissions'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PermissionGuard } from '@/components/guard'
import type { ClassifiedPackage } from '../data/classified.type'
import { useClassifiedPackages } from '../hooks/use-classified'
import { useClassifiedMutations } from '../hooks/use-classified-mutations'
import { ClassifiedPackageCard } from './classified-package-card'
import { ClassifiedPackageDialog } from './classified-package-dialog'

/** Listing packages customers buy to upload more classified products (offline payment requests live in Payments). */
export function ClassifiedPackagesPage() {
  const { t } = useTranslation('classified')
  const { data } = useClassifiedPackages()
  const packages = data?.data ?? []
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<ClassifiedPackage | null>(null)
  const [removing, setRemoving] = useState<ClassifiedPackage | null>(null)
  const { removePackage } = useClassifiedMutations()

  return (
    <AdminPageShell
      title={t('packages.title')}
      description={t('packages.description')}
      actions={
        <PermissionGuard permission={PERMISSIONS.CLASSIFIED.PACKAGES_MANAGE}>
          <Button onClick={() => setCreating(true)}>
            <Plus className='me-2 size-4' />
            {t('packages.new')}
          </Button>
        </PermissionGuard>
      }
    >
      {packages.length === 0 ? (
        <p className='text-muted-foreground'>{t('packages.empty')}</p>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {packages.map((p) => (
            <ClassifiedPackageCard
              key={p.id}
              pack={p}
              onEdit={setEditing}
              onDelete={setRemoving}
            />
          ))}
        </div>
      )}
      {creating && (
        <ClassifiedPackageDialog
          open
          onOpenChange={(open) => !open && setCreating(false)}
          packages={packages}
        />
      )}
      {editing && (
        <ClassifiedPackageDialog
          key={editing.id}
          open
          onOpenChange={(open) => !open && setEditing(null)}
          pack={editing}
          packages={packages}
        />
      )}
      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={t('packages.deleteTitle')}
        desc={t('packages.deleteDesc', { name: removing?.name })}
        confirmText={t('actions.delete')}
        destructive
        isLoading={removePackage.isPending}
        handleConfirm={() =>
          removing &&
          removePackage.mutate(removing.id, {
            onSettled: () => setRemoving(null),
          })
        }
      />
    </AdminPageShell>
  )
}
