import { type ColumnDef } from '@tanstack/react-table'
// Removed BadgeType
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/custom/data-table'

interface BadgeTableProps {
  data: any[]
  onEdit: (badge: any) => void
  onDelete: (badge: any) => void
}

export function BadgeTable({ data, onEdit, onDelete }: BadgeTableProps) {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'preview',
      header: 'Preview',
      cell: ({ row }) => {
        const badge = row.original
        return (
          <div
            className='inline-flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none'
            style={{
              backgroundColor: badge.bgColor,
              color: badge.textColor,
            }}
          >
            {badge.imageUrl && (
              <img
                src={badge.imageUrl}
                alt=''
                className='h-3 w-3 object-contain'
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            {badge.label.en}
          </div>
        )
      },
    },
    {
      accessorKey: 'label.en',
      header: 'Label (EN)',
    },
    {
      accessorKey: 'code',
      header: 'Code',
      cell: ({ row }) => (
        <span className='font-mono text-xs'>{row.original.code}</span>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'default' : 'secondary'}>
          {row.original.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      accessorKey: 'isSystem',
      header: 'Type',
      cell: ({ row }) => {
        const isSystem = row.getValue('isSystem')
        return isSystem ? (
          <Badge variant='secondary' className='bg-primary/10 text-primary'>
            System
          </Badge>
        ) : (
          <Badge variant='outline'>Custom</Badge>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const badge = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(badge)}>
                <Edit className='mr-2 h-4 w-4' />
                Edit
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(badge)}
                  className='text-destructive focus:text-destructive'
                >
                  <Trash className='mr-2 h-4 w-4' />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return <DataTable columns={columns} data={data} searchKey='label.en' />
}
