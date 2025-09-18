import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { statuses } from '../data/data'
import { useGetConnectedAccountsForOutreachQuery } from '../graphql/operations.generated'
import { DataTableSingleFilter } from './data-table-single-filter'
import { DataTableViewOptions } from './data-table-view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const globalFilter = table.getState().globalFilter

  // Load connected accounts for sender filter
  const { data: connectedAccountsData } = useGetConnectedAccountsForOutreachQuery()

  const senderOptions = (connectedAccountsData?.connectedAccounts || [])
    .filter((account) => account.isLinkedinEnabled || account.isEmailEnabled)
    .map((account) => ({
      label: account.name,
      value: account.id,
    }))

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Search contacts...'
          value={globalFilter ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        {table.getColumn('status') && (
          <DataTableSingleFilter
            column={table.getColumn('status')}
            title='Status'
            options={statuses}
          />
        )}
        {table.getColumn('sender') && senderOptions.length > 0 && (
          <DataTableSingleFilter
            column={table.getColumn('sender')}
            title='Sender'
            options={senderOptions}
          />
        )}
        {(isFiltered || globalFilter) && (
          <Button
            variant='ghost'
            onClick={() => {
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
