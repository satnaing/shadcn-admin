import { type OptionGroup } from '@/types/api'
import { toast } from 'sonner'
import { useDeleteOptionGroup } from '@/hooks/queries/use-catalog'
import { DataTable } from '@/components/custom/data-table'
import { getColumns } from './option-groups-columns.tsx'

interface OptionGroupsTableProps {
  onEdit: (group: OptionGroup) => void
  data: OptionGroup[]
  pageCount?: number
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange?: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void
}

export function OptionGroupsTable({
  onEdit,
  data,
  pageCount,
  pagination,
  onPaginationChange,
}: OptionGroupsTableProps) {
  const { mutate: deleteGroup } = useDeleteOptionGroup()

  const handleDelete = (group: any) => {
    const id = group.id || group.sku
    if (!id) return
    deleteGroup(id, {
      onSuccess: () => {
        toast.success('Option group deleted')
      },
      onError: () => {
        toast.error('Failed to delete option group')
      },
    })
  }

  // TODO: Update columns to support actions with onDelete and onEdit
  // For now we just pass data
  const tableColumns = getColumns({
    onEdit: onEdit as any,
    onDelete: handleDelete,
  })

  return (
    <DataTable
      columns={tableColumns}
      data={data as any}
      searchKey='name'
      searchPlaceholder='Filter option groups...'
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
    />
  )
}
