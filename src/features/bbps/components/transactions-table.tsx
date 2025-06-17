import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TransactionTablePagination } from './transactions-table-pagination'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
} from '@tanstack/react-table'
import * as React from 'react'

export interface Transaction {
  id: string
  bbpsReferenceCode: string
  customerName: string
  customerNumber: string
  category: string
  billerName: string
  billAmount: number
  paymentMode: string
  transactionStatus: 'Success' | 'Pending' | 'Failed'
  transactionDate: string
}

interface Column {
  accessorKey: keyof Transaction
  header: string
}

interface TransactionsTableProps {
  data: Transaction[]
  columns: Column[]
}

export function TransactionsTable({ data, columns }: TransactionsTableProps) {
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const columnDefs = columns.map((col) => ({
    accessorKey: col.accessorKey,
    header: col.header,
  })) as ColumnDef<Transaction, any>[]

  const table = useReactTable({
    data,
    columns: columnDefs,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className='space-y-4'>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.accessorKey}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {cell.getValue() as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TransactionTablePagination table={table} />
    </div>
  )
}
