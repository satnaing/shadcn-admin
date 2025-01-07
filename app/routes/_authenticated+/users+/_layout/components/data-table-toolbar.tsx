import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '~/components/ui/button'
import { userTypes } from '../../_shared/data/data'
import { useDataTableState } from '../hooks/use-data-table-state'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { SearchInput } from './search-input'

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
    useDataTableState()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <SearchInput
          key={queries.username}
          autoFocus
          placeholder="Filter users..."
          defaultValue={queries.username}
          onSearch={(value) => {
            updateQueries({
              username: value,
            })
          }}
        />
        <div className="flex gap-x-2">
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              filterKey="status"
              title="Status"
              options={[
                {
                  label: 'Active',
                  value: 'active',
                  count: facetedCounts?.status.active,
                },
                {
                  label: 'Inactive',
                  value: 'inactive',
                  count: facetedCounts?.status.inactive,
                },
                {
                  label: 'Invited',
                  value: 'invited',
                  count: facetedCounts?.status.invited,
                },
                {
                  label: 'Suspended',
                  value: 'suspended',
                  count: facetedCounts?.status.suspended,
                },
              ]}
            />
          )}
          {table.getColumn('role') && (
            <DataTableFacetedFilter
              filterKey="role"
              title="Role"
              options={userTypes.map((t) => ({
                ...t,
                count: facetedCounts?.role[t.value],
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
