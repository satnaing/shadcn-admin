import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { priorities, statuses } from '../../_shared/data/data'
import { useFilterPagination } from '../hooks/use-filter-pagination'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

export type FacetedCountProps = Record<string, Record<string, number>>

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  facetedCounts?: FacetedCountProps
}

export function DataTableToolbar<TData>({
  table,
  facetedCounts,
}: DataTableToolbarProps<TData>) {
  const { queries, updateQueries, isFiltered, resetFilters } =
    useFilterPagination()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          key={queries.title}
          type="search"
          placeholder="Filter tasks..."
          defaultValue={queries.title}
          onChange={(event) => {
            const value = event.currentTarget.value
            updateQueries({
              title: value,
            })
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              filterKey="status"
              title="Status"
              options={statuses.map((status) => ({
                ...status,
                count: facetedCounts?.status[status.value],
              }))}
            />
          )}
          {table.getColumn('priority') && (
            <DataTableFacetedFilter
              filterKey="priority"
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
            onClick={() => resetFilters()}
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
