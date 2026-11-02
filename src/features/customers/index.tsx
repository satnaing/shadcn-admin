import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AdminHeader } from '@/components/admin/admin-header'
import { Main } from '@/components/layout/main'
import { CustomerDetailDialog } from './components/customer-detail-dialog'
import { CustomerFilterBar } from './components/customer-filter-bar'
import { CustomersTable } from './components/customers-table'
import { type CustomerFilterParams, type CustomerItem } from './data/customers.type'
import { useCustomerMutations, useCustomers } from './hooks/useCustomers'

export function CustomersList() {
  const { t } = useTranslation('customers')
  const [filters, setFilters] = useState<CustomerFilterParams>({ page: 1, per_page: 10 })
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerItem | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const { data, isLoading } = useCustomers(filters)
  const { banMutation, deleteCustomerMutation } = useCustomerMutations()

  const customers = data?.data ?? []

  const handleView = (customer: CustomerItem) => {
    setSelectedCustomer(customer)
    setDetailOpen(true)
  }

  const handleToggleBan = (id: number, current: boolean) => {
    banMutation.mutate({ id, is_banned: !current })
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('confirmDelete', 'Bu müştərini silmək istədiyinizə əminsiniz?'))) {
      deleteCustomerMutation.mutate(id)
    }
  }

  return (
    <>
      <AdminHeader />
      <Main fluid className='space-y-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('title', 'Müştəri Siyahısı')}
          </h1>
          <p className='text-sm text-muted-foreground'>
            {t('subtitle', 'Bütün qeydiyyatdan keçmiş müştərilərin idarəsi')}
          </p>
        </div>

        <div className='flex flex-col gap-3 rounded-lg border bg-card p-4'>
          <CustomerFilterBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ page: 1, per_page: 10 })}
          />

          <CustomersTable
            customers={customers}
            isLoading={isLoading}
            onView={handleView}
            onToggleBan={handleToggleBan}
            onDelete={handleDelete}
          />
        </div>

        <CustomerDetailDialog
          customer={selectedCustomer}
          open={detailOpen}
          onOpenChange={setDetailOpen}
          onToggleBan={handleToggleBan}
        />
      </Main>
    </>
  )
}

export default CustomersList
