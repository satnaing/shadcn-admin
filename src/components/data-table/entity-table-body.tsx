import { memo, type ReactElement } from 'react'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { flexRender, type Row } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { TableBody, TableCell, TableRow } from '@/components/ui/table'
import { SortableTableRow } from './sortable-table-row'

interface EntityTableBodyProps<TData> {
  rows: Row<TData>[]
  columnCount: number
  noResultsMessage: string
  enableRowReorder: boolean
  isReordering: boolean
}

function StaticTableRows<TData>({ rows }: { rows: Row<TData>[] }) {
  return (
    <>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && 'selected'}
          className='group/row'
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              className={cn(
                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                cell.column.columnDef.meta?.className,
                cell.column.columnDef.meta?.tdClassName
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

function SortableTableRows<TData>({
  rows,
  isReordering,
}: {
  rows: Row<TData>[]
  isReordering: boolean
}) {
  const rowIds = rows.map((row) => row.id)

  return (
    <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
      {rows.map((row) => (
        <SortableTableRow key={row.id} row={row} disabled={isReordering} />
      ))}
    </SortableContext>
  )
}

function EntityTableBodyInner<TData>({
  rows,
  columnCount,
  noResultsMessage,
  enableRowReorder,
  isReordering,
}: EntityTableBodyProps<TData>) {
  if (rows.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={columnCount} className='h-24 text-center'>
            {noResultsMessage}
          </TableCell>
        </TableRow>
      </TableBody>
    )
  }

  return (
    <TableBody>
      {enableRowReorder ? (
        <SortableTableRows rows={rows} isReordering={isReordering} />
      ) : (
        <StaticTableRows rows={rows} />
      )}
    </TableBody>
  )
}

export const EntityTableBody = memo(EntityTableBodyInner) as <TData>(
  props: EntityTableBodyProps<TData>
) => ReactElement
