import { useState } from 'react'
import { type Staff } from '@/types/staff'
import { useStaff } from '@/hooks/queries/use-staff'
import { BrandLoader } from '@/components/ui/brand-loader'
import { PageTitle } from '@/components/page-title'
import { EmployeeSheet } from '@/features/staff/_components/employee-sheet'
import { EmployeesTable } from '@/features/staff/_components/employees-table'

export default function EmployeesPage() {
  const [open, setOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: response, isLoading } = useStaff({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  })

  const staffData = response?.data || []

  const handleEdit = (staff: Staff) => {
    setSelectedStaff(staff)
    setOpen(true)
  }

  const handleCreate = () => {
    setSelectedStaff(null)
    setOpen(true)
  }

  if (isLoading) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='space-y-6 p-6'>
      <PageTitle
        title='Master HR Database'
        subtitle='Manage all employees across the organization.'
        buttonLabel='Add Employee'
        onClick={handleCreate}
      />
      <EmployeesTable
        data={staffData}
        onEdit={handleEdit}
        pageCount={response?.meta?.totalPages}
        pagination={pagination}
        onPaginationChange={setPagination}
      />

      <EmployeeSheet
        open={open}
        onOpenChange={(val) => {
          setOpen(val)
          if (!val) setSelectedStaff(null)
        }}
        initialData={selectedStaff}
      />
    </div>
  )
}
