import { ColumnDef, Column, Row } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import LongText from '@/components/long-text'
import { Student } from '../data/schema'
import { studentFieldMetadata } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

const STUDENT_REPRESENTATIVE_FIELD_ATTRIBUTE = {
  meta: {
    className: cn(
      'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none',
      'bg-background transition-, duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
      'sticky left-6 md:table-cell'
    ),
  },
  enableHiding: false,
}

export const columns: ColumnDef<Student>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  ...Object.entries(studentFieldMetadata).map(([name, metadata]) => ({
    accessorKey: name,
    header: ({ column }: { column: Column<Student> }) => (
      <DataTableColumnHeader column={column} title={metadata.label} />
    ),
    cell: ({ row }: { row: Row<Student> }) => {
      const value = row.getValue(name)
      return <LongText className='max-w-36'>{String(value)}</LongText>
    },
    ...(metadata.isRepresentative && {
      ...STUDENT_REPRESENTATIVE_FIELD_ATTRIBUTE,
    }),
  })),

  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
