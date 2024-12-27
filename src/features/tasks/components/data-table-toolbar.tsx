import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Trash2Icon } from 'lucide-react'
import useDialogState from '@/hooks/use-dialog-state'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DataTableViewOptions } from '../components/data-table-view-options'
import { TasksDialogType } from '../context/tasks-context'
import { priorities, statuses } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter tasks...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={statuses}
            />
          )}
          {table.getColumn('priority') && (
            <DataTableFacetedFilter
              column={table.getColumn('priority')}
              title='Priority'
              options={priorities}
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
      <ConfirmDialog
        key='tasks-delete'
        destructive
        open={open === 'multiple-delete'}
        onOpenChange={() => {
          setOpen('multiple-delete')
        }}
        handleConfirm={() => {
          setOpen(null)
          toast({
            title: 'The following tasks have been deleted:',
            description: (
              <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                <code className='text-white'>
                  {table.getSelectedRowModel().rows.map((row) => (
                    <>
                      {JSON.stringify(row.getValue('id'), null, 2)}
                      <br />
                    </>
                  ))}
                </code>
              </pre>
            ),
          })
        }}
        className='max-w-md'
        title={`Delete selected tasks ?`}
        desc={
          <>
            You are about to delete the selected Tasks. <br />
            This action cannot be undone.
          </>
        }
        confirmText='Delete'
      />
    </div>
  )
}
