import { ColumnDef } from '@tanstack/react-table'
import type { Transaction } from './transactions-table'
import { DataTableColumnHeader } from './data-table-column-header'

export const bbpsColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Transaction ID' />
    ),
  },
  {
    accessorKey: 'bbpsReferenceCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='BBPS Reference Code' />
    ),
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer Name' />
    ),
  },
  {
    accessorKey: 'mobileNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mobile Number' />
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Category' />
    ),
  },
  {
    accessorKey: 'billerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Biller Name' />
    ),
  },
  {
    accessorKey: 'billAmount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bill Amount' />
    ),
  },
  {
    accessorKey: 'paymentMode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Payment Mode' />
    ),
  },
  {
    accessorKey: 'transactionStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Transaction Status' />
    ),
  },
  {
    accessorKey: 'transactionDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Transaction Date' />
    ),
  },
]
