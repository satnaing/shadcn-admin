import { useState } from 'react'
import { useOptionGroups } from '@/hooks/queries/use-catalog'
import { BrandLoader } from '@/components/ui/brand-loader'
import { PageTitle } from '@/components/page-title'
import { type ProductOptionGroup } from '../data/schema'
import { OptionGroupSheet } from './_components/option-group-sheet'
import { OptionGroupsTable } from './_components/option-groups-table'

export default function OptionsPage() {
  const [open, setOpen] = useState(false)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [selectedGroup, setSelectedGroup] = useState<ProductOptionGroup | null>(
    null
  )

  const { data: response, isLoading } = useOptionGroups({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })

  const handleEdit = (group: any) => {
    setSelectedGroup(group)
    setOpen(true)
  }

  if (isLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='p-6'>
      <PageTitle
        title='Option Groups'
        subtitle='Manage variants, modifiers, and add-ons for your menu.'
        onClick={() => {
          setSelectedGroup(null)
          setOpen(true)
        }}
      />

      <OptionGroupsTable
        onEdit={handleEdit}
        data={response?.data || []}
        pageCount={response?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <OptionGroupSheet
        open={open}
        onOpenChange={setOpen}
        initialData={selectedGroup}
      />
    </div>
  )
}
