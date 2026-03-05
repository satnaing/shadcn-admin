import { type Staff } from '@/types/staff'
import { DataTable } from '@/components/custom/data-table'
import { columns } from './employees-columns'

interface EmployeesTableProps {
  data: Staff[]
  onEdit: (staff: Staff) => void
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

export function EmployeesTable({
  data,
  onEdit,
  pageCount,
  pagination,
  onPaginationChange,
}: EmployeesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='fullName'
      searchPlaceholder='Search employees...'
      meta={{ onEdit }}
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
    />
  )
}
