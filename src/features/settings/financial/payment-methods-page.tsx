import { useState } from 'react'
import type { PaymentMethod } from '@/types/api'
import {
  usePaymentMethods,
  useTogglePaymentMethod,
} from '@/hooks/queries/use-payment-methods'
import { BrandLoader } from '@/components/ui/brand-loader'
import { DataTable } from '@/components/custom/data-table'
import { PageTitle } from '@/components/page-title'
import { columns } from './components/payment-methods-columns'
import { PaymentMethodSheet } from './components/payment-methods-sheet'

export function PaymentMethodsPage() {
  const [open, setOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null)

  const { data: paymentMethods = [], isLoading } = usePaymentMethods()
  const { mutate: toggleStatus } = useTogglePaymentMethod()

  const handleEdit = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod)
    setOpen(true)
  }

  const handleToggle = (paymentMethod: PaymentMethod) => {
    toggleStatus({ id: paymentMethod.id, isActive: !paymentMethod.isActive })
  }

  if (isLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='flex flex-col space-y-4 p-6 pt-6'>
      <PageTitle
        title='Payment Methods'
        subtitle='Manage global payment methods for customer checkout.'
        onClick={() => {
          setSelectedPaymentMethod(null)
          setOpen(true)
        }}
      />

      <DataTable
        columns={columns}
        data={paymentMethods}
        searchKey='name.en'
        searchPlaceholder='Filter payment methods...'
        meta={{ onEdit: handleEdit, onToggle: handleToggle }}
      />

      <PaymentMethodSheet
        open={open}
        onOpenChange={setOpen}
        initialData={selectedPaymentMethod}
      />
    </div>
  )
}
