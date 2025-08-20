import { ColumnDef } from '@tanstack/react-table'
import type { BBPSUpload } from './table'
import { DataTableColumnHeader } from '../../bbps/components/data-table-column-header'


export const upiColumns: ColumnDef<BBPSUpload>[] = [
    
    {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
  },
  {
    accessorKey: 'file_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='File Name' />
    ),
  },
  {
    accessorKey: 'original_path',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Original Path' />
    ),
  },
  {
    accessorKey: 'result_path',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Result Path' />
    ),
  },
  {
    accessorKey: 'reason',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reason' />
    ),
  },
  {
    accessorKey: 'upload_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Uploaded date' />
    ),
  },
  {
    accessorKey: 'processed_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Processed Date' />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
  }
]
