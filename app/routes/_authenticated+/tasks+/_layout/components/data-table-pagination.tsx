import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { useSearchParams } from 'react-router'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

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

export const PaginationSearchParamsSchema = z.object({
  page: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.string().optional().default('1').transform(Number),
  ),
  per_page: z.preprocess(
    (val) => (val === null ? undefined : val),
    z
      .union([
        z.literal('10'),
        z.literal('20'),
        z.literal('30'),
        z.literal('40'),
        z.literal('50'),
      ])
      .optional()
      .default('20')
      .transform(Number),
  ),
})

const searchParamKeys = {
  page: 'page',
  pageSize: 'per_page',
} as const

export function DataTablePagination<TData>({
  table,
  pagination: { currentPage, pageSize, totalPages, totalItems },
}: DataTablePaginationProps<TData>) {
  const [, setSearchParams] = useSearchParams()

  return (
    <div className="flex items-center justify-between overflow-auto px-2">
      <div className="hidden flex-1 text-sm text-muted-foreground sm:block">
        {table.getFilteredSelectedRowModel().rows.length} of {totalItems} row(s)
        selected.
      </div>
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select
            defaultValue={`${pageSize}`}
            onValueChange={(value) => {
              setSearchParams(
                (prev) => {
                  prev.set(searchParamKeys.pageSize, value)
                  prev.set(searchParamKeys.page, '1')
                  return prev
                },
                { preventScrollReset: true },
              )
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
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
              setSearchParams(
                (prev) => {
                  prev.delete(searchParamKeys.page)
                  return prev
                },
                { preventScrollReset: true },
              )
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
              setSearchParams(
                (prev) => {
                  if (currentPage === 2) {
                    prev.delete(searchParamKeys.page)
                  } else {
                    prev.set(searchParamKeys.page, `${currentPage - 1}`)
                  }
                  return prev
                },
                { preventScrollReset: true },
              )
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
              setSearchParams(
                (prev) => {
                  prev.set(searchParamKeys.page, `${currentPage + 1}`)
                  return prev
                },
                { preventScrollReset: true },
              )
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
              setSearchParams(
                (prev) => {
                  prev.set(searchParamKeys.page, `${totalPages}`)
                  return prev
                },
                { preventScrollReset: true },
              )
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
