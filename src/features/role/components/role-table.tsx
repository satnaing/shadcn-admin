import { Lock, Pencil, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PermissionGuard } from '@/components/guard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PERMISSIONS } from '@/shared/permissions'
import type { Role } from '../data/role.type'

interface RoleTableProps {
  roles: Role[]
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RoleTable({ roles, onEdit, onDelete }: RoleTableProps) {
  const { t } = useTranslation('roles')

  if (roles.length === 0) {
    return <p className='py-10 text-center text-sm text-muted-foreground'>{t('list.empty')}</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('columns.name')}</TableHead>
          <TableHead className='hidden md:table-cell'>{t('columns.description')}</TableHead>
          <TableHead>{t('columns.permissions')}</TableHead>
          <TableHead className='hidden sm:table-cell'>{t('columns.users')}</TableHead>
          <TableHead className='w-24' />
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.id}>
            <TableCell className='font-medium'>
              <span className='flex items-center gap-2'>
                {role.name}
                {role.system && <Lock className='size-3.5 text-muted-foreground' aria-label={t('list.system')} />}
              </span>
            </TableCell>
            <TableCell className='hidden text-muted-foreground md:table-cell'>
              {role.description}
            </TableCell>
            <TableCell>
              <Badge variant='secondary'>{role.permissions.length}</Badge>
            </TableCell>
            <TableCell className='hidden sm:table-cell'>{role.users_count}</TableCell>
            <TableCell>
              {!role.system && (
                <div className='flex justify-end gap-1'>
                  <PermissionGuard permission={PERMISSIONS.ROLES.UPDATE}>
                    <Button size='icon' variant='ghost' onClick={() => onEdit(role)} aria-label={t('list.edit')}>
                      <Pencil className='size-4' />
                    </Button>
                  </PermissionGuard>
                  <PermissionGuard permission={PERMISSIONS.ROLES.DELETE}>
                    <Button size='icon' variant='ghost' onClick={() => onDelete(role)} aria-label={t('list.delete')}>
                      <Trash2 className='size-4' />
                    </Button>
                  </PermissionGuard>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
