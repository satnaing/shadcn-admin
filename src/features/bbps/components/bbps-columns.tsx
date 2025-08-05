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
    accessorKey: 'customerId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer ID' />
    ),
  },
  {
    accessorKey: 'account_no',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Account No' />
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
    accessorKey: 'billerStatus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Biller Status' />
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
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
  },
  {
    accessorKey: 'updaredAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Updated At' />
    ),
  },
  {
    accessorKey: 'pgTxnRefId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PG Transaction Ref ID' />
    ),
  },
  {
    accessorKey: 'bbpsReferenceCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='BBPS Reference Code' />
    ),
  },
]
