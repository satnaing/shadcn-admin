import { type Staff } from '@/types/staff'
import { DataTable } from '@/components/custom/data-table'
import { columns } from './employees-columns'

interface EmployeesTableProps {
  data: Staff[]
  onEdit: (staff: Staff) => void
}

export function EmployeesTable({ data, onEdit }: EmployeesTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='fullName'
      searchPlaceholder='Search employees...'
      meta={{ onEdit }}
    />
  )
}
