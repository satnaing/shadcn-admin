import { useState } from 'react'
import { type UnitOfMeasure } from '@/types/inventory'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useUnits, useDeleteUnit } from '@/hooks/queries/use-inventory'
import { BrandLoader } from '@/components/ui/brand-loader'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/data-table'
import { PageTitle } from '@/components/page-title'
import { UnitSheet } from './_components/unit-sheet'
import { columns } from './_components/units-columns'

export default function UnitsSettingsPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const { data: response, isLoading } = useUnits({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })
  const units = response?.data || []
  const deleteUnit = useDeleteUnit()
  const [open, setOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<UnitOfMeasure | null>(null)

  const handleEdit = (unit: UnitOfMeasure) => {
    setSelectedUnit(unit)
    setOpen(true)
  }

  const handleDelete = (unit: UnitOfMeasure) => {
    if (confirm(`Are you sure you want to delete unit "${unit.name.en}"?`)) {
      deleteUnit.mutate(unit.id, {
        onSuccess: () => {
          toast.success('Unit deleted successfully')
        },
        onError: () => {
          toast.error('Failed to delete unit')
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className='flex h-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between'>
        <PageTitle title='Units of Measure' />
        <Button
          onClick={() => {
            setSelectedUnit(null)
            setOpen(true)
          }}
          size='sm'
        >
          <Plus className='mr-2 h-4 w-4' />
          Add Unit
        </Button>
      </div>

      <DataTable
        columns={columns(handleEdit, handleDelete)}
        data={units}
        searchKey='name'
        searchPlaceholder='Filter units...'
        pageCount={response?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <UnitSheet
        open={open}
        onOpenChange={setOpen}
        initialData={selectedUnit}
      />
    </div>
  )
}
