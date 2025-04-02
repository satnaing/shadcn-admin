import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
// import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
// import { callTypes, userTypes } from '../data/data'
import { Company } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Company>[] = [
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
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'company_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='company_name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('company_name')}</LongText>
    ),
    meta: {
      className: cn(
        'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
        'sticky left-6 md:table-cell'
      ),
    },
    enableHiding: false,
  },
  {
    accessorKey: 'hr_manager_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='인사담당자' />
    ),
    cell: ({ row }) => {
      return <LongText>{row.getValue('hr_manager_name')}</LongText>
    },
    // id: '인사담당자',
    },
    {
    accessorKey: 'hr_manager_phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='연락처' />
    ),
    cell: ({ row }) => (
      <div className='w-fit text-nowrap'>{row.getValue('hr_manager_phone')}</div>
    ),
    // id: '연락처'
  },
  {
    accessorKey: 'company_address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='주소' />
    ),
    cell: ({ row }) => {
      return <LongText>{row.getValue('company_address')}</LongText>
    },
    // id: '주소',
    },
  //   {
  //   accessorKey: 'hr_manager_phone',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='연락처' />
  //   ),
  //   cell: ({ row }) => (
  //     <div className='w-fit text-nowrap'>{row.getValue('hr_manager_phone')}</div>
  //   ),
  // },
  // {
  //   accessorKey: 'phoneNumber',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Phone Number' />
  //   ),
  //   cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
  //   enableSorting: false,
  // },
  // {
  //   accessorKey: 'status',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Status' />
  //   ),
  //   cell: ({ row }) => {
  //     const { status } = row.original
  //     const badgeColor = callTypes.get(status)
  //     return (
  //       <div className='flex space-x-2'>
  //         <Badge variant='outline' className={cn('capitalize', badgeColor)}>
  //           {row.getValue('status')}
  //         </Badge>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  //   enableHiding: false,
  //   enableSorting: false,
  // },
  // {
  //   accessorKey: 'role',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Role' />
  //   ),
  //   cell: ({ row }) => {
  //     const { role } = row.original
  //     const userType = userTypes.find(({ value }) => value === role)

  //     if (!userType) {
  //       return null
  //     }

  //     return (
  //       <div className='flex items-center gap-x-2'>
  //         {userType.icon && (
  //           <userType.icon size={16} className='text-muted-foreground' />
  //         )}
  //         <span className='text-sm capitalize'>{row.getValue('role')}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
