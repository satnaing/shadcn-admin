import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { Lock, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PERMISSIONS } from '@/shared/permissions'
import type { Role } from '../data/role.type'

export function useRoleColumns(onEdit: (role: Role) => void, onDelete: (role: Role) => void): ColumnDef<Role>[] {
  const { t } = useTranslation('roles')

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        ...translatedColumnHeader<Role, unknown>('roles:columns.name'),
        cell: ({ row }) => (
          <span className='flex items-center gap-2 font-medium'>
            {row.original.name}
            {row.original.system && <Lock className='size-3.5 text-muted-foreground' aria-label={t('list.system')} />}
          </span>
        ),
      },
      {
        accessorKey: 'description',
        enableSorting: false,
        ...translatedColumnHeader<Role, unknown>('roles:columns.description'),
        cell: ({ row }) => <span className='text-muted-foreground'>{row.original.description}</span>,
      },
      {
        id: 'permissions',
        enableSorting: false,
        ...translatedColumnHeader<Role, unknown>('roles:columns.permissions'),
        cell: ({ row }) => <Badge variant='secondary'>{row.original.permissions.length}</Badge>,
      },
      {
        accessorKey: 'users_count',
        ...translatedColumnHeader<Role, unknown>('roles:columns.users'),
      },
      {
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) =>
          row.original.system ? null : (
            <div className='flex justify-end gap-1'>
              <PermissionGuard permission={PERMISSIONS.ROLES.UPDATE}>
                <Button size='icon' variant='ghost' onClick={() => onEdit(row.original)} aria-label={t('list.edit')}>
                  <Pencil className='size-4' />
                </Button>
              </PermissionGuard>
              <PermissionGuard permission={PERMISSIONS.ROLES.DELETE}>
                <Button size='icon' variant='ghost' onClick={() => onDelete(row.original)} aria-label={t('list.delete')}>
                  <Trash2 className='size-4' />
                </Button>
              </PermissionGuard>
            </div>
          ),
      },
    ],
    [t, onEdit, onDelete]
  )
}
