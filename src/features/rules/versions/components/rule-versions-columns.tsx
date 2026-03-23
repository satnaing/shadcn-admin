import { useState } from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Download, Loader2, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
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
import { fetchRuleDetail } from '../api'

type ColumnsProps = {
  userId: string
  onEdit: (row: RuleVersion) => void
  onDelete: (row: RuleVersion) => void
  onStatusChange: (row: RuleVersion, newStatus: string) => void
}

function DownloadButton({ row, userId }: { row: RuleVersion; userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    setLoading(true)
    fetchRuleDetail(userId, row.proj_id, row.rule_id)
      .then((detail) => {
        const content = JSON.stringify(detail.rule_graph, null, 2)
        const blob = new Blob([content], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${row.rule_id}.json`
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(() => toast.error('导出失败，请重试'))
      .finally(() => setLoading(false))
  }

  return (
    <Button
      variant='ghost'
      size='sm'
      className='h-8 px-2 text-xs'
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? <Loader2 className='mr-1 size-3 animate-spin' /> : <Download className='mr-1 size-3' />}
      导出规则图
    </Button>
  )
}

export function getRuleVersionColumns({
  userId,
  onEdit,
  onDelete,
  onStatusChange,
}: ColumnsProps): ColumnDef<RuleVersion>[] {
  return [
    {
      accessorKey: 'rule_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='规则编号' />
      ),
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Badge variant='outline' className='font-mono text-xs'>
            {row.getValue('rule_id')}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'rule_name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='规则名称' />
      ),
      cell: ({ row }) => (
        <span className='font-semibold'>{row.getValue('rule_name')}</span>
      ),
    },
    {
      accessorKey: 'rule_status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='规则状态' />
      ),
      cell: ({ row }) => {
        const currentStatus = row.getValue('rule_status') as string
        const status = versionStatuses.find((s) => s.value === currentStatus)

        const statusColors = {
          active: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300',
          watch: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300',
          close: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300',
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
      accessorKey: 'rule_desc',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='规则描述' />
      ),
      cell: ({ row }) => (
        <span className='max-w-[400px] truncate text-sm text-muted-foreground'>
          {row.getValue('rule_desc')}
        </span>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'update_time',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='更新时间' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {String(row.getValue('update_time')).slice(0, 19).replace('T', ' ')}
        </span>
      ),
    },
    {
      accessorKey: 'create_time',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='创建时间' />
      ),
      cell: ({ row }) => (
        <span className='text-sm text-muted-foreground'>
          {String(row.getValue('create_time')).slice(0, 19).replace('T', ' ')}
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
            size='sm'
            className='h-8 px-2 text-xs'
            onClick={() => onEdit(row.original)}
          >
            <Pencil className='mr-1 size-3' />
            编辑规则
          </Button>
          <DownloadButton row={row.original} userId={userId} />
          <Button
            variant='ghost'
            size='sm'
            className='h-8 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive'
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className='mr-1 size-3' />
            删除规则
          </Button>
        </div>
      ),
    },
  ]
}
