import type { UseFormReturn } from 'react-hook-form'
import { useAllRoles } from '@/features/role/hooks/useAllRoles'
import type { CreateUserFormValues, UpdateUserFormValues } from '../data/schema'
import { RoleCheckboxGroup } from './role-checkbox-group'

interface UsersRoleFieldsProps {
  form: UseFormReturn<CreateUserFormValues | UpdateUserFormValues>
}

export function UsersRoleFields({ form }: UsersRoleFieldsProps) {
  const { data: roles = [] } = useAllRoles()

  return (
    <RoleCheckboxGroup
      roles={roles}
      value={form.watch('role_ids')}
      onChange={(val) => form.setValue('role_ids', val)}
    />
  )
}
