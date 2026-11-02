import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { Button } from '@/components/ui/button'
import { PackageCard } from './components/package-card'
import { PackageFormDialog } from './components/package-form-dialog'
import { type CustomerPackageItem } from './data/customers.type'
import { useCustomerMutations, useCustomerPackages } from './hooks/useCustomers'

export function CustomerPackagesList() {
  const { t } = useTranslation('customers')
  const [selectedPkg, setSelectedPkg] = useState<Partial<CustomerPackageItem> | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data, isLoading } = useCustomerPackages()
  const { packageMutation } = useCustomerMutations()

  const packages = data?.data ?? []

  const handleCreate = () => {
    setSelectedPkg({})
    setDialogOpen(true)
  }

  const handleEdit = (pkg: CustomerPackageItem) => {
    setSelectedPkg(pkg)
    setDialogOpen(true)
  }

  const handleSave = (payload: Partial<CustomerPackageItem>) => {
    packageMutation.mutate(payload)
    setDialogOpen(false)
  }

  const handleDelete = (_id: number) => {
    if (window.confirm(t('confirmDeletePackage', 'Bu paketi silmək istədiyinizə əminsiniz?'))) {
      // Mock delete
    }
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>
              {t('packages.title', 'Elan Paketləri')}
            </h1>
            <p className='text-sm text-muted-foreground'>
              {t('packages.subtitle', 'Müştərilərin elan yerləşdirməsi üçün paketlər və limitlər')}
            </p>
          </div>

          <Button onClick={handleCreate} className='gap-2'>
            <Plus className='size-4' />
            {t('packages.addNew', 'Yeni Paket Əlavə Et')}
          </Button>
        </div>

        {isLoading ? (
          <div className='flex h-48 items-center justify-center text-sm text-muted-foreground'>
            {t('loading', 'Yüklənir...')}
          </div>
        ) : (
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <PackageFormDialog
          pkg={selectedPkg}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSave={handleSave}
        />
      </Main>
    </>
  )
}

export default CustomerPackagesList
