import { useState } from 'react'
import type { SurchargeConfig } from '@/types/api'
import {
  useSurcharges,
  useToggleSurcharge,
} from '@/hooks/queries/use-surcharges'
import { BrandLoader } from '@/components/ui/brand-loader'
import { DataTable } from '@/components/custom/data-table'
import { PageTitle } from '@/components/page-title'
import { columns } from './components/surcharges-columns'
import { SurchargeSheet } from './components/surcharges-sheet'

export default function FinancialSettingsPage() {
  const [open, setOpen] = useState(false)
  const [selectedSurcharge, setSelectedSurcharge] =
    useState<SurchargeConfig | null>(null)

  const { data: surcharges = [], isLoading } = useSurcharges()
  const { mutate: toggleSurcharge } = useToggleSurcharge()

  const handleEdit = (surcharge: SurchargeConfig) => {
    setSelectedSurcharge(surcharge)
    setOpen(true)
  }

  const handleToggle = (surcharge: SurchargeConfig) => {
    toggleSurcharge(surcharge.id)
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
        title='Financial Settings'
        subtitle='Manage taxes, surcharges, and service fees.'
        onClick={() => {
          setSelectedSurcharge(null)
          setOpen(true)
        }}
      />

      <DataTable
        columns={columns}
        data={surcharges}
        searchKey='name.en'
        searchPlaceholder='Filter surcharges...'
        meta={{ onEdit: handleEdit, onToggle: handleToggle }}
      />

      <SurchargeSheet
        open={open}
        onOpenChange={setOpen}
        initialData={selectedSurcharge}
      />
    </div>
  )
}
