import { Cross2Icon } from '@radix-ui/react-icons'
import type { Table } from '@tanstack/react-table'
import { Button } from '~/components/ui/button'
import { FILTER_FIELD_LABELS, FILTER_FIELDS } from '../config/constants'
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
          key={queries.title}
          autoFocus
          placeholder="Filter tasks..."
          defaultValue={queries.title}
          onSearch={(value) => {
            updateQueries({
              title: value,
            })
          }}
        />
        <div className="flex gap-x-2">
          {FILTER_FIELDS.filter((filterKey) => table.getColumn(filterKey)).map(
            (filterKey) => {
              const options = FILTER_FIELD_LABELS[filterKey]
              return (
                <DataTableFacetedFilter
                  key={filterKey}
                  filterKey={filterKey}
                  title={filterKey}
                  options={options.map((option) => ({
                    ...option,
                    count: facetedCounts?.[filterKey][option.value],
                  }))}
                />
              )
            },
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
