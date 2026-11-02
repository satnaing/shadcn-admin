import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { SellerPackageCard } from './components/seller-package-card'
import { SellerPackageFormDialog } from './components/seller-package-form-dialog'
import { type SellerPackageItem } from './data/sellers.type'
import { useSellerMutations, useSellerPackages } from './hooks/useSellers'

export function SellerPackages() {
  const { t } = useTranslation('sellers')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPkg, setEditingPkg] = useState<SellerPackageItem | null>(null)

  const { data, isLoading } = useSellerPackages()
  const { packageMutation, deletePackageMutation } = useSellerMutations()

  const packages = data?.data ?? []

  const handleSave = (payload: Partial<SellerPackageItem>) => {
    packageMutation.mutate(payload, {
      onSuccess: () => {
        toast.success(
          payload.id
            ? t('messages.packageUpdated', 'Paket yeniləndi!')
            : t('messages.packageCreated', 'Yeni paket yaradıldı!')
        )
      },
    })
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('messages.confirmDeletePackage', 'Bu paketi silmək istədiyinizə əminsiniz?'))) {
      deletePackageMutation.mutate(id, {
        onSuccess: () => {
          toast.success(t('messages.packageDeleted', 'Paket silindi!'))
        },
      })
    }
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('titles.packages', 'Satıcı Paketləri (E29)')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('titles.packagesSubtitle', 'Satıcı abunəlik planları və məhsul yükləmə limitləri')}
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingPkg(null)
              setDialogOpen(true)
            }}
            className='gap-2'
          >
            <Plus className='size-4' />
            {t('packages.addNew', 'Yeni Paket Yarat')}
          </Button>
        </div>

        {isLoading ? (
          <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
            {t('table.loading', 'Yüklənir...')}
          </div>
        ) : packages.length === 0 ? (
          <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
            {t('packages.empty', 'Heç bir satıcı paketi tapılmadı')}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'>
            {packages.map((pkg) => (
              <SellerPackageCard
                key={pkg.id}
                pkg={pkg}
                onEdit={(p) => {
                  setEditingPkg(p)
                  setDialogOpen(true)
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <SellerPackageFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialData={editingPkg}
          onSave={handleSave}
        />
      </Main>
    </>
  )
}

export default SellerPackages
