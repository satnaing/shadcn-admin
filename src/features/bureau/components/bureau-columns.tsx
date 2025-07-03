
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';


export interface BureauRow {
  name: string;
  customer_id: number;
  score: number;
  bureau_id: number;
  pull_source: string;
  created_at: string;
}

export const columns: ColumnDef<BureauRow>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />, 
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('name')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'customer_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Customer ID" />, 
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('customer_id')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'score',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />, 
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('score')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'bureau_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bureau ID" />, 
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('bureau_id')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'pull_source',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pull Source" />, 
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('pull_source')}</div>,
    enableHiding: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />, 
    cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('created_at')}</div>,
    enableHiding: false,
  },
];
