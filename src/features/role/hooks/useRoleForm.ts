import { type Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type RoleFormValues, roleSchema } from '../data/role.schema'

export const useRoleForm = (defaultValues?: Partial<RoleFormValues>) => {
  return useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema) as unknown as Resolver<RoleFormValues>,
    defaultValues: {
      name: '',
      guard_name: 'web',
      permission_ids: [],
      ...defaultValues,
    },
  })
}
