import { type Resolver, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  type PermissionFormValues,
  permissionSchema,
} from '../data/permission.schema'

export const usePermissionForm = (
  defaultValues?: Partial<PermissionFormValues>
) => {
  return useForm<PermissionFormValues>({
    resolver: zodResolver(
      permissionSchema
    ) as unknown as Resolver<PermissionFormValues>,
    defaultValues: {
      name: '',
      guard_name: '',
      ...defaultValues,
    },
  })
}
