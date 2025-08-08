import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  PAGINATION_PER_PAGE_ITEMS,
  useDataTableState,
} from '../hooks/use-data-table-state'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pagination: PaginationProps
}

export interface PaginationProps {
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
}

export function DataTablePagination<TData>({
  table,
  pagination: { currentPage, pageSize, totalPages, totalItems },
}: DataTablePaginationProps<TData>) {
  const { updatePagination } = useDataTableState()

  return (
    <div className="flex items-center justify-between overflow-auto px-2">
      <div className="text-muted-foreground hidden flex-1 text-sm sm:block">
        {table.getFilteredSelectedRowModel().rows.length} of {totalItems} row(s)
        selected.
      </div>
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select
            defaultValue={`${pageSize}`}
            onValueChange={(value) => {
              const newPerPage = Number(value)
              const newTotalPages = Math.ceil(totalItems / newPerPage)

              updatePagination({
                per_page: newPerPage,
                // Only reset page if current page would be invalid with new per_page
                ...(currentPage > newTotalPages ? { page: newTotalPages } : {}),
              })
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGINATION_PER_PAGE_ITEMS.map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              updatePagination({
                page: 1,
              })
            }}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              updatePagination({
                page: currentPage - 1,
              })
            }}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              updatePagination({
                page: currentPage + 1,
              })
            }}
            disabled={currentPage === totalPages || totalPages === 1}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              updatePagination({
                page: totalPages,
              })
            }}
            disabled={currentPage === totalPages || totalPages === 1}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
