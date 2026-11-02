import { memo, type ReactElement } from 'react'
import { flexRender, type HeaderGroup } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface EntityTableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[]
}

function EntityTableHeaderInner<TData>({
  headerGroups,
}: EntityTableHeaderProps<TData>) {
  return (
    <TableHeader>
      {headerGroups.map((headerGroup) => (
        <TableRow key={headerGroup.id} className='group/row'>
          {headerGroup.headers.map((header) => (
            <TableHead
              key={header.id}
              colSpan={header.colSpan}
              className={cn(
                'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                header.column.columnDef.meta?.className,
                header.column.columnDef.meta?.thClassName
              )}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  )
}

export const EntityTableHeader = memo(EntityTableHeaderInner) as <TData>(
  props: EntityTableHeaderProps<TData>
) => ReactElement
