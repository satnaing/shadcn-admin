import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'

/** Leading checkbox column for tables that use `BulkActions` (EntityDataTable only enables selection state). */
export function selectColumn<TData>(selectAllLabel: string, selectRowLabel: string): ColumnDef<TData> {
  return {
    id: 'select',
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label={selectAllLabel}
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={selectRowLabel}
        className='translate-y-0.5'
      />
    ),
  }
}
