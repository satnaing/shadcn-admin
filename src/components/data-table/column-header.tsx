import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
} from '@radix-ui/react-icons'
import { type Column, type HeaderContext } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const columnLabelKeys = new WeakMap<Column<unknown, unknown>, string>()

export function getColumnLabelKey(
  column: Column<unknown, unknown>
): string | undefined {
  return column.columnDef.meta?.labelKey ?? columnLabelKeys.get(column)
}

type DataTableColumnHeaderProps<TData, TValue> =
  React.HTMLAttributes<HTMLDivElement> & {
    column: Column<TData, TValue>
    titleKey: string
  }

export function translatedColumnHeader<TData, TValue>(titleKey: string) {
  return {
    header: ({ column }: HeaderContext<TData, TValue>) => (
      <DataTableColumnHeader column={column} titleKey={titleKey} />
    ),
    meta: {
      labelKey: titleKey,
    },
  }
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  titleKey,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation()
  const title = t(titleKey)

  columnLabelKeys.set(column as Column<unknown, unknown>, titleKey)

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant='ghost'
        size='sm'
        className='-ml-3 h-8'
        onClick={() => {
          if (column.getIsSorted() === 'asc') {
            column.toggleSorting(true)
          } else {
            column.toggleSorting(false)
          }
        }}
      >
        <span>{title}</span>
        {column.getIsSorted() === 'desc' ? (
          <ArrowDownIcon className='ms-2 h-4 w-4' />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUpIcon className='ms-2 h-4 w-4' />
        ) : (
          <CaretSortIcon className='ms-2 h-4 w-4' />
        )}
      </Button>
    </div>
  )
}
