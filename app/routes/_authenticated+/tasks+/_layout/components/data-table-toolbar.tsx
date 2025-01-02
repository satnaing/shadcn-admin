import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { priorities, statuses } from '../../_shared/data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

export const FilterSearchParamsSchema = z.object({
  status: z.array(z.string()).optional().default([]),
  priority: z.array(z.string()).optional().default([]),
})

export interface FacetedCountProps {
  priority: Record<string, number>
  status: Record<string, number>
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  facetedCounts?: FacetedCountProps
}

export function DataTableToolbar<TData>({
  table,
  facetedCounts,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              searchParamKey="status"
              title="Status"
              options={statuses.map((status) => ({
                ...status,
                count: facetedCounts?.status[status.value],
              }))}
            />
          )}
          {table.getColumn('priority') && (
            <DataTableFacetedFilter
              searchParamKey="priority"
              title="Priority"
              options={priorities.map((priority) => ({
                ...priority,
                count: facetedCounts?.priority[priority.value],
              }))}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
