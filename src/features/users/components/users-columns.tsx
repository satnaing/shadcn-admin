import { type ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { callTypes } from '../data/data'
import { type User } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'
import { useUsersData } from './use-users-data'

export function useUsersColumns(): ColumnDef<User>[] {
  const { t } = useTranslation()
  const { roles } = useUsersData()

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-0.5'
        />
      ),
      meta: {
        className: cn('inset-s-0 z-10 rounded-tl-[inherit] max-md:sticky'),
      },
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-0.5'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'username',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.username')} />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-36 ps-3'>
          {row.getValue('username')}
        </LongText>
      ),
      meta: {
        className: cn(
          'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
          'inset-s-6 ps-0.5 max-md:sticky @4xl/content:table-cell @4xl/content:drop-shadow-none'
        ),
      },
      enableHiding: false,
    },
    {
      id: 'fullName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.name')} />
      ),
      cell: ({ row }) => {
        const { firstName, lastName } = row.original
        const fullName = `${firstName} ${lastName}`
        return <LongText className='max-w-36'>{fullName}</LongText>
      },
      meta: { className: 'w-36' },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.email')} />
      ),
      cell: ({ row }) => (
        <div className='w-fit ps-2 text-nowrap'>{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t('users.phone_number')}
        />
      ),
      cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.status')} />
      ),
      cell: ({ row }) => {
        const { status } = row.original
        const badgeColor = callTypes.get(status)
        const statusLabel =
          status === 'active'
            ? t('users.status_active')
            : status === 'inactive'
              ? t('users.status_inactive')
              : status === 'invited'
                ? t('users.status_invited')
                : t('users.status_suspended')
        return (
          <div className='flex space-x-2'>
            <Badge variant='outline' className={cn('capitalize', badgeColor)}>
              {statusLabel}
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableHiding: false,
      enableSorting: false,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t('users.role')} />
      ),
      cell: ({ row }) => {
        const { role } = row.original
        const userType = roles.find(({ value }) => value === role)

        if (!userType) {
          return null
        }

        return (
          <div className='flex items-center gap-x-2'>
            {userType.icon && (
              <userType.icon size={16} className='text-muted-foreground' />
            )}
            <span className='text-sm'>{userType.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'actions',
      cell: DataTableRowActions,
    },
  ]
}
