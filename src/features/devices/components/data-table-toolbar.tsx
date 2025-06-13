import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deviceTypesList } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

// Device status options for filter dropdown
const deviceStatusOptions = [
  { label: 'In Use', value: 'in_use' },
  { label: 'In Store', value: 'in_store' },
  { label: 'Allocated', value: 'allocated' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Disposed', value: 'disposed' },
  { label: 'Fault', value: 'fault' },
]

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
                                          table,
                                        }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter devices...'
          value={
            (table.getColumn('device_name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('device_name')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={deviceStatusOptions}
            />
          )}
          {table.getColumn('device_type') && (
            <DataTableFacetedFilter
              column={table.getColumn('device_type')}
              title='Device Type'
              options={deviceTypesList.map((t) => ({
                label: t.label,
                value: t.value,
                icon: t.icon,
              }))}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
