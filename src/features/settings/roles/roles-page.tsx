import { useRoles, usePermissions } from '@/hooks/queries/use-roles'
import { BrandLoader } from '@/components/ui/brand-loader'
import { RolesTable } from './roles-table'

export default function RolesPage() {
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles()
  const { data: permissions = [], isLoading: isLoadingPermissions } =
    usePermissions()

  if (isLoadingRoles || isLoadingPermissions) {
    return (
      <div className='flex h-[80vh] w-full items-center justify-center p-6'>
        <BrandLoader />
      </div>
    )
  }

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <RolesTable data={roles} permissions={permissions as any[]} />
    </div>
  )
}
