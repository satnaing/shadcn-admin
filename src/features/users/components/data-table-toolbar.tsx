import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Trash2Icon } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UsersDialogType } from '../context/users-context'
import { userTypes } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { UsersDeleteMultipleDialog } from './users-delete-multiple-dialog'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [open, setOpen] = useDialogState<UsersDialogType>(null)
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter tasks...'
          value={
            (table.getColumn('username')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('username')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Invited', value: 'invited' },
                { label: 'Suspended', value: 'suspended' },
              ]}
            />
          )}
          {table.getColumn('role') && (
            <DataTableFacetedFilter
              column={table.getColumn('role')}
              title='Role'
              options={userTypes.map((t) => ({ ...t }))}
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
        {table.getSelectedRowModel().rows.length > 1 && (
          <Trash2Icon
            className={'text-red-600 ml-2 cursor-pointer'}
            size={18}
            onClick={() => setOpen('multiple-delete')}
          />
        )}
      </div>

      <DataTableViewOptions table={table} />
      <UsersDeleteMultipleDialog
        key={`users-delete-multiple`}
        open={open === 'multiple-delete'}
        onOpenChange={() => {
          setOpen('multiple-delete')
        }}
        table={table}
      />
    </div>
  )
}
