import { format } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/data-table'
import { type AuditLog } from '../data/audit-log-schema'

interface AuditLogsTableProps {
  data: AuditLog[]
  onViewDetails: (log: AuditLog) => void
  pageCount?: number
  pagination?: {
    pageIndex: number
    pageSize: number
  }
  onPaginationChange?: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void
}

export function AuditLogsTable({
  data,
  onViewDetails,
  pageCount,
  pagination,
  onPaginationChange,
}: AuditLogsTableProps) {
  const columns: ColumnDef<AuditLog>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Timestamp',
      cell: ({ row }) => (
        <span className='font-mono text-sm'>
          {format(row.original.createdAt, 'MMM d, HH:mm:ss')}
        </span>
      ),
    },
    {
      accessorKey: 'actorName',
      header: 'Actor',
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <span className='text-sm font-medium'>{row.original.actorName}</span>
        </div>
      ),
    },
    {
      accessorKey: 'actionType',
      header: 'Action',
      cell: ({ row }) => {
        const type = row.original.actionType
        let variant: 'default' | 'destructive' | 'outline' | 'secondary' =
          'default'

        if (type === 'DELETE') variant = 'destructive'
        else if (type === 'CREATE') variant = 'outline' // Using outline (often green/neutral) or default (blue) depending on theme. Request said Green for Create, Blue for Update.
        // Shadcn default is typically Black/Primary. Destructive is Red.
        // We can custom style or just map to closest variants.
        // Let's stick to variants for consistency, but maybe add explicit colors if strict adherence to "Create=Green" is needed.
        // For now: Delete=Destructive (Red), Update=Default (Primary), Create=Outline (Neutral), Refund=Secondary.
        // If exact colors required, we'd use className="bg-green-500..."

        return <Badge variant={variant}>{type}</Badge>
      },
    },
    {
      accessorKey: 'targetResource',
      header: 'Resource',
      cell: ({ row }) => (
        <span className='text-sm'>{row.original.targetResource}</span>
      ),
    },
    {
      accessorKey: 'shopCode',
      header: 'Shop',
      cell: ({ row }) => (
        <span className='font-mono text-xs'>
          {row.original.shopCode || 'HQ'}
        </span>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <Button
          variant='ghost'
          size='sm'
          onClick={() => onViewDetails(row.original)}
        >
          <Eye className='mr-2 h-4 w-4' />
          View Changes
        </Button>
      ),
    },
  ]

  // Define filters for the data table
  const filters = [
    {
      columnId: 'actionType',
      title: 'Action Type',
      options: [
        { label: 'Create', value: 'CREATE' },
        { label: 'Update', value: 'UPDATE' },
        { label: 'Delete', value: 'DELETE' },
        { label: 'Refund', value: 'REFUND' },
      ],
    },
    // Note: Data table component might not support multiple specific filters out of the box depending on implementation
    // But passing it here if the component supports it.
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      searchKey='actorName'
      filters={filters}
      pageCount={pageCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
    />
  )
}
