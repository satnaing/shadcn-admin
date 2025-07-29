import {ColumnDef} from '@tanstack/react-table';
import type {WealthData} from './wealth-table';
import {DataTableColumnHeader} from './data-table-column-header';
import { StatusCell } from './status-cell';


export const wealthColumns = (searchParams: {
    customerId: string;
    mobile: string;
    pan: string;
    email: string;
} | null, pageIndex: number): ColumnDef<WealthData>[] => [
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
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Customer ID' />
    ),
  },
  {
    accessorKey: 'name',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
  {
    accessorKey: 'mobile',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Mobile' />
    ),
  },
  {
    accessorKey: 'product',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Product' />
    ),
  },
  {
    accessorKey: 'pan',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='PAN' />
    ),
  },
  {
    accessorKey: 'accountNumber',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Account Number' />
    ),
  },
  {
    accessorKey: 'bankName',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Bank Name' />
    ),
  },
  {
    accessorKey: 'ifsc',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='IFSC' />
    ),
  },
  {
    accessorKey: 'email',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
  },
  {
    accessorKey: 'aadhar',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Aadhar' />
    ),
  },
  {
    accessorKey: 'panImgUrl',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='PAN Image URL' />
    ),
  },
  {
    accessorKey: 'aadharImgUrl',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Aadhar Image URL' />
    ),
    },
    {
    accessorKey: 'cancelledChequeImgUrl',
    header: ({column}) => (
      <DataTableColumnHeader column={column} title='Cancelled Cheque Image URL' />
    ),
    },
   
    {
      accessorKey: 'arn',
      header:({column})=>(
        <DataTableColumnHeader column = {column} title='ARN'/>
      )
    },
    {
      accessorKey: 'companyName',
      header: ({column})=>(
       < DataTableColumnHeader column={column} title='Company Name'/>
      )
    }
]