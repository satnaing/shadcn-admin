import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Customer } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'

export const allColumns: ColumnDef<Customer>[] = [
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
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='ID' />
		),
		cell: ({ row }) => (
			<div className='w-fit text-nowrap'>{row.getValue('id')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Name' />
		),
		cell: ({ row }) => (
			<div className='w-fit text-nowrap'>{row.getValue('name')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'mobile',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Mobile' />
		),
		cell: ({ row }) => (
			<div className='w-fit text-nowrap'>{row.getValue('mobile')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Email' />
		),
		cell: ({ row }) => (
			<div className='w-fit text-nowrap'>{row.getValue('email')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'dob',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='DOB' />
		),
		cell: ({ row }) => (
			<div className='w-fit text-nowrap'>{row.getValue('dob')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'pin_code',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Pin Code' />
		),
		cell: ({ row }) => {
			const pin = row.getValue('pin_code') as string;
			if (!pin) return '';
			const visible = pin.slice(-2);
			const masked = '*'.repeat(Math.max(0, pin.length - 2)) + visible;
			return <div className='w-fit text-nowrap'>{masked}</div>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'vpa',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='VPA' />
		),
		cell: ({ row }) => {
			const vpa = row.getValue('vpa') as string;
			if (!vpa) return '';
			const [beforeAt, afterAt] = vpa.split('@');
			if (!beforeAt || beforeAt.length <= 2) return vpa;
			const visible = beforeAt.slice(0, 2);
			const masked = visible + '*'.repeat(beforeAt.length - 2);
			return <div className='w-fit text-nowrap'>{masked + (afterAt ? '@' + afterAt : '')}</div>;
		},
		enableHiding: false,
	},
	{
		accessorKey: 'upi_linked',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='UPI Linked' />
		),
		cell: ({ row }) => (
			<div className='w-fit text-nowrap'>{row.getValue('upi_linked')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'utm_source',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='UTM Source' />
		),
		cell: ({ row }) => (
			<div className='w-fit text-nowrap'>{row.getValue('utm_source')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'category',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Category' />
		),
		cell: ({ row }) => (
			<div className='w-fit text-nowrap'>{row.getValue('category')}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: 'created_at',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title='Created At' />
		),
		cell: ({ row }) => (
			<div className='w-fit text-nowrap'>{row.getValue('created_at')}</div>
		),
		enableHiding: false,
	},
]

// Only export first 5 columns by default
export const defaultColumns = allColumns.slice(0, 5);