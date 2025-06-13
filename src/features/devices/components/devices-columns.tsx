import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { deviceStatusStyles, deviceTypesList } from '../data/data'
import { Device } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Device>[] = [
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
    accessorKey: 'device_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Device Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('device_name')}</LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'serial_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Serial Number' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-36'>{row.getValue('serial_number')}</LongText>
    ),
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Brand' />
    ),
    cell: ({ row }) => <div>{row.getValue('brand')}</div>,
  },
  {
    accessorKey: 'model',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Model' />
    ),
    cell: ({ row }) => <div>{row.getValue('model')}</div>,
  },
  {
    accessorKey: 'processor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='CPU (Cores)' />
    ),
    cell: ({ row }) => <div>{row.getValue('processor')}</div>,
  },
  {
    accessorKey: 'RAM',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='RAM (GB)' />
    ),
    cell: ({ row }) => <div>{row.getValue('RAM')}</div>,
  },
  {
    accessorKey: 'storage',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Storage (GB)' />
    ),
    cell: ({ row }) => <div>{row.getValue('storage')}</div>,
  },
  {
    accessorKey: 'mac_address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='MAC Address' />
    ),
    cell: ({ row }) => <div>{row.getValue('mac_address')}</div>,
  },
  {
    accessorKey: 'year_of_purchase',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Year Purchased' />
    ),
    cell: ({ row }) => <div>{row.getValue('year_of_purchase')}</div>,
  },
  {
    accessorKey: 'device_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Type' />
    ),
    cell: ({ row }) => {
      const deviceType = deviceTypesList.find(
        ({ value }) => value === row.original.device_type
      )
      return (
        <div className='flex items-center gap-x-2'>
          {deviceType?.icon && (
            <deviceType.icon size={16} className='text-muted-foreground' />
          )}
          <span className='text-sm capitalize'>
            {deviceType?.label || row.getValue('device_type')}
          </span>
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
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const { status } = row.original
      const badgeColor = deviceStatusStyles.get(status)
      return (
        <div className='flex space-x-2'>
          <Badge variant='outline' className={cn('capitalize', badgeColor)}>
            {status.replace(/_/g, ' ')}
          </Badge>
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
