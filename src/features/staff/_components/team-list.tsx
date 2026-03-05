import { useMemo } from 'react'
import { type Staff } from '@/types/staff'
import { useStaff } from '@/hooks/queries/use-staff'
import { BrandLoader } from '@/components/ui/brand-loader'
import { DataTable } from '@/components/custom/data-table'
import { columns } from './team-columns'

interface TeamListProps {
  shopId: string
}

export function TeamList({ shopId }: TeamListProps) {
  const { data: response, isLoading } = useStaff({ shopId })
  const staffList = response?.data || []

  const filteredData = useMemo(() => {
    return staffList.filter((staff) =>
      staff.access.some((a) => a.shopId === shopId)
    )
  }, [staffList, shopId])

  const handleResetPin = (staff: Staff) => {
    alert(`Resetting PIN for ${staff.fullName} (Mock Action)`)
  }

  if (isLoading) {
    return (
      <div className='flex h-48 items-center justify-center'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      searchKey='fullName'
      searchPlaceholder='Search team...'
      meta={{ shopId, onResetPin: handleResetPin }}
    />
  )
}
