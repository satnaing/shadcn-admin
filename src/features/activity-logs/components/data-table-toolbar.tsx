import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'

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
          placeholder='Search activity logs...'
          value={(table.getColumn('userName')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('userName')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('resource') && (
            <DataTableFacetedFilter
              column={table.getColumn('resource')}
              title='Resource'
              options={[
                { label: 'User', value: 'user' },
                { label: 'Task', value: 'task' },
                { label: 'Setting', value: 'setting' },
                { label: 'Role', value: 'role' },
                { label: 'System', value: 'system' },
                { label: 'Data', value: 'data' },
              ]}
            />
          )}
          {table.getColumn('severity') && (
            <DataTableFacetedFilter
              column={table.getColumn('severity')}
              title='Severity'
              options={[
                {
                  label: 'Info',
                  value: 'info',
                  icon: IconInfoCircle,
                },
                {
                  label: 'Success',
                  value: 'success',
                  icon: IconCircleCheck,
                },
                {
                  label: 'Warning',
                  value: 'warning',
                  icon: IconAlertTriangle,
                },
                {
                  label: 'Error',
                  value: 'error',
                  icon: IconX,
                },
              ]}
            />
          )}
          {table.getColumn('action') && (
            <DataTableFacetedFilter
              column={table.getColumn('action')}
              title='Action'
              options={[
                { label: 'User Created', value: 'user.created' },
                { label: 'User Updated', value: 'user.updated' },
                { label: 'User Deleted', value: 'user.deleted' },
                { label: 'User Login', value: 'user.login' },
                { label: 'User Logout', value: 'user.logout' },
                { label: 'Task Created', value: 'task.created' },
                { label: 'Task Updated', value: 'task.updated' },
                { label: 'Task Deleted', value: 'task.deleted' },
                { label: 'Settings Updated', value: 'settings.updated' },
                { label: 'Role Assigned', value: 'role.assigned' },
                { label: 'Data Exported', value: 'export.data' },
              ]}
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
