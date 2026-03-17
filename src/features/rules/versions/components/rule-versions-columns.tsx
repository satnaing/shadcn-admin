import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTableColumnHeader } from '@/components/data-table'
import { versionStatuses } from '../data/data'
import { type RuleVersion } from '../data/schema'

type ColumnsProps = {
  onEdit: (row: RuleVersion) => void
  onDelete: (row: RuleVersion) => void
  onStatusChange: (row: RuleVersion, newStatus: string) => void
}

export function getRuleVersionColumns({
  onEdit,
  onDelete,
  onStatusChange,
}: ColumnsProps): ColumnDef<RuleVersion>[] {
  return [
    {
      accessorKey: 'ruleNumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='规则编号' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className='font-mono text-xs'>
            {row.getValue('ruleNumber')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'versionName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='版本名称' />
      ),
      cell: ({ row }) => (
        <span className='font-semibold'>{row.getValue('versionName')}</span>
      ),
    },
    {
      accessorKey: 'versionStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='版本状态' />
      ),
      cell: ({ row }) => {
        const currentStatus = row.getValue('versionStatus') as string
        const status = versionStatuses.find((s) => s.value === currentStatus)

        const statusColors = {
          enabled: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300',
          observing: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300',
          disabled: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300',
        }

        return (
          <Select
            value={currentStatus}
            onValueChange={(value) => onStatusChange(row.original, value)}
          >
            <SelectTrigger className='w-[140px] border-0 shadow-none'>
              <SelectValue>
                {status && (
                  <Badge className={statusColors[currentStatus as keyof typeof statusColors]}>
                    <status.icon className='mr-1 size-3' />
                    {status.label}
                  </Badge>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {versionStatuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  <div className='flex items-center gap-2'>
                    <s.icon className='size-4' />
                    <span>{s.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='版本描述' />
      ),
      cell: ({ row }) => (
        <span className='max-w-[400px] truncate text-sm text-muted-foreground'>
          {row.getValue('description')}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='更新时间' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {row.getValue('updatedAt')}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='创建时间' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {row.getValue('createdAt')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='icon'
            className='size-8'
            onClick={() => onEdit(row.original)}
          >
            <Pencil className='size-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 text-destructive hover:bg-destructive/10 hover:text-destructive'
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className='size-4' />
          </Button>
        </div>
      ),
    },
  ]
}
