import { memo, type ReactElement } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { flexRender, type Row } from '@tanstack/react-table'
import { GripVertical } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { TableCell, TableRow } from '@/components/ui/table'
import { DRAG_COLUMN_ID } from './constants'

interface SortableTableRowProps<TData> {
  row: Row<TData>
  disabled?: boolean
}

function SortableTableRowInner<TData>({
  row,
  disabled = false,
}: SortableTableRowProps<TData>) {
  const { t } = useTranslation('common')
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    disabled,
  })

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      data-state={row.getIsSelected() && 'selected'}
      className={cn('group/row', isDragging && 'relative z-10 opacity-60')}
    >
      {row.getVisibleCells().map((cell) => {
        const isDragHandle = cell.column.id === DRAG_COLUMN_ID

        return (
          <TableCell
            key={cell.id}
            className={cn(
              'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
              cell.column.columnDef.meta?.className,
              cell.column.columnDef.meta?.tdClassName
            )}
          >
            {isDragHandle ? (
              <button
                type='button'
                ref={setActivatorNodeRef}
                className='inline-flex size-8 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50'
                disabled={disabled}
                {...attributes}
                {...listeners}
                aria-label={t('reorder')}
              >
                <GripVertical className='size-4' aria-hidden />
              </button>
            ) : (
              flexRender(cell.column.columnDef.cell, cell.getContext())
            )}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export const SortableTableRow = memo(SortableTableRowInner) as <TData>(
  props: SortableTableRowProps<TData>
) => ReactElement
