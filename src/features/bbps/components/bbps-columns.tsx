import type { Transaction } from './transactions-table';

export const bbpsColumns: { accessorKey: keyof Transaction; header: string }[] = [
  {
    accessorKey: 'id',
    header: 'Transaction ID',
  },
  {
    accessorKey: 'bbpsReferenceCode',
    header: 'BBPS Reference Code',
  },
  { accessorKey: 'customerName',
     header: 'Customer Name' 
    },
  {
    accessorKey: 'customerNumber',
    header: 'Customer Number',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'billerName',
    header: 'Biller Name',
  },
  {
    accessorKey: 'billAmount',
    header: 'Bill Amount',
  },
  {
    accessorKey: 'paymentMode',
    header: 'Payment Mode',
  },
  {
    accessorKey: 'transactionStatus',
    header: 'Transaction Status',
  },
  {
    accessorKey: 'transactionDate',
    header: 'Transaction Date',
  }, 

]
