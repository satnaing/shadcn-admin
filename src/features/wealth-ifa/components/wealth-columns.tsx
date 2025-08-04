import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { StatusCell } from './status-cell'
import type { WealthData } from './wealth-table'

export const wealthColumns = (
  searchParams: {
    customerId: string
    mobile: string
    pan: string
    email: string
  } | null,
  pageIndex: number,
  handleFileDownload?: (url: string, name: string) => void
): ColumnDef<WealthData>[] => [
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <StatusCell
        data={{
          name: row.original.name,
          status: row.original.status,
          customerId: row.original.customerId,
        }}
        searchParams={searchParams}
        pageIndex={pageIndex}
      />
    ),
  },
  {
    accessorKey: 'customerId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Customer ID' />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
  {
    accessorKey: 'mobile',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mobile' />
    ),
  },
  {
    accessorKey: 'product',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Product' />
    ),
  },
  {
    accessorKey: 'pan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PAN' />
    ),
  },
  {
    accessorKey: 'accountNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Account Number' />
    ),
  },
  {
    accessorKey: 'bankName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bank Name' />
    ),
  },
  {
    accessorKey: 'ifsc',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='IFSC' />
    ),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
  },
  {
    accessorKey: 'aadhar',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Aadhar' />
    ),
  },
  {
    accessorKey: 'panImgUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PAN' />
    ),
    cell: ({ row }) => {
      const url = row.original.panImgUrl
      return url ? (
        <button
          className='text-blue-600 hover:underline'
          onClick={() =>
            handleFileDownload?.(url, `${row.original.customerId}_PAN`)
          }
        >
          Download PAN
        </button>
      ) : (
        <span className='text-gray-400'>N/A</span>
      )
    },
  },
  {
    accessorKey: 'aadharImgUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Aadhar' />
    ),
    cell: ({ row }) => {
      const url = row.original.aadharImgUrl
      return url ? (
        <button
          className='text-blue-600 hover:underline'
          onClick={() =>
            handleFileDownload?.(url, `${row.original.customerId}_Aadhar`)
          }
        >
          Download Aadhar
        </button>
      ) : (
        <span className='text-gray-400'>N/A</span>
      )
    },
  },
  {
    accessorKey: 'cancelledChequeImgUrl',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Cancelled Cheque' />
    ),
    cell: ({ row }) => {
      const url = row.original.cancelledChequeImgUrl
      return url ? (
        <button
          className='text-blue-600 hover:underline'
          onClick={() =>
            handleFileDownload?.(
              url,
              `${row.original.customerId}_Cancelled_Cheque`
            )
          }
        >
          Download Cancelled Cheque
        </button>
      ) : (
        <span className='text-gray-400'>N/A</span>
      )
    },
  },
  {
    accessorKey: 'arn',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ARN' />
    ),
  },
  {
    accessorKey: 'companyName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Company Name' />
    ),
  },
]
