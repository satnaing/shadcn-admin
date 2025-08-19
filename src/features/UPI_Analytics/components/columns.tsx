import { ColumnDef } from '@tanstack/react-table'
import type { UPIAnalytics } from './table'
import { DataTableColumnHeader } from '../../bbps/components/data-table-column-header'


export const upiColumns: ColumnDef<UPIAnalytics>[] = [
    {
    accessorKey: 'span',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Timeline' />
    ),
  },
  {
    accessorKey: 'unique_users_onboarded',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Unique Users Onboarded' />
    ),
  },
  {
    accessorKey: 'unique_bank_account',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Unique Bank Accounts' />
    ),
  },
  {
    accessorKey: 'users_linked_bank_account',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Users Linked Bank Accounts' />
    ),
  },
  {
    accessorKey: 'users_linked_rupay_creditcard',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Users Linked with rupay Credit Card' />
    ),
  },
  {
    accessorKey: 'users_linked_credit_line',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Users linked with Credit Line' />
    ),
  },
  {
    accessorKey: 'upi_lite_setup_users',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Users with UPI Lite setup' />
    ),
  },
  {
    accessorKey: 'users_setup_auto_pay',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Users with Auto-pay setup' />
    ),
  }
]
