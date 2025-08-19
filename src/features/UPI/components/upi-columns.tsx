import { ColumnDef } from '@tanstack/react-table'
import type { UPITransaction } from './upi-transactions-table'
import { DataTableColumnHeader } from '../../bbps/components/data-table-column-header'

export const upiColumns: ColumnDef<UPITransaction>[] = [
  {
    accessorKey: 'customer_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer ID' />
    ),
  },
  {
    accessorKey: 'payer_vpa',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payer VPA' />
    ),
  },
  {
    accessorKey: 'mobile',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mobile Number' />
    ),
  },
  {
    accessorKey: 'payee_vpa',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payee VPA' />
    ),
  },
  {
    accessorKey: 'payee_acc_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payee Account Number' />
    ),
  },
  {
    accessorKey: 'payee_ifsc',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payee IFSC' />
    ),
  },
  {
    accessorKey: 'utr',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Transaction Ref Number' />
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
  },
  {
    accessorKey: 'txn_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Transaction Status' />
    ),
  },
  {
    accessorKey: 'response_code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Response Code' />
    ),
  },
  {
    accessorKey: 'response_message',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Response Message' />
    ),
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated At' />
    ),
  },
]
