import { useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { toServerListParams } from '@/shared/utils/list-query-string'
import { Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { EntityDataTable } from '@/components/data-table'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { EARNING_TABS, type EarningItem } from '../data/club-point.type'
import { useEarnings } from '../hooks/use-club-point'
import { ClubPointLinesDialog } from './club-point-lines-dialog'
import { ClubPointTabs } from './club-point-tabs'

const h = (key: string) =>
  translatedColumnHeader<EarningItem, unknown>(`club_point:columns.${key}`)

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Points customers earned per order and whether they were already converted to wallet money. */
export function ClubPointEarningsPage({ search, navigate }: Props) {
  const { t } = useTranslation('club_point')
  const [viewing, setViewing] = useState<EarningItem | null>(null)
  const params = toServerListParams(search, {
    filters: ['tab'],
    defaultSort: 'created_at',
  })
  const { data } = useEarnings(params)
  const tabs = EARNING_TABS.map((value) => ({
    value,
    label: t(value === 'all' ? 'tabs.all' : `status.${value}`),
  }))
  const columns = useMemo<ColumnDef<EarningItem>[]>(
    () => [
      {
        accessorKey: 'order_code',
        ...h('order'),
        cell: ({ row }) =>
          row.original.order_code ? (
            `#${row.original.order_code}`
          ) : (
            <span className='text-muted-foreground'>
              {t('earnings.noOrder')}
            </span>
          ),
      },
      {
        accessorKey: 'customer_name',
        ...h('customer'),
        cell: ({ row }) =>
          row.original.customer_name ?? (
            <span className='text-muted-foreground'>
              {t('earnings.noUser')}
            </span>
          ),
      },
      { accessorKey: 'points', ...h('points') },
      {
        accessorKey: 'convert_status',
        enableSorting: false,
        ...h('status'),
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.convert_status === 'converted'
                ? 'default'
                : 'outline'
            }
          >
            {t(`status.${row.original.convert_status}`)}
          </Badge>
        ),
      },
      {
        accessorKey: 'created_at',
        ...h('earnedAt'),
        cell: ({ row }) => row.original.created_at.slice(0, 10),
      },
      {
        id: 'actions',
        enableSorting: false,
        enableHiding: false,
        header: () => null,
        cell: ({ row }) => (
          <div className='flex justify-end'>
            <Button
              size='icon'
              variant='ghost'
              aria-label={t('actions.view')}
              onClick={() => setViewing(row.original)}
            >
              <Eye className='size-4' />
            </Button>
          </div>
        ),
      },
    ],
    [t]
  )

  return (
    <AdminPageShell
      title={t('earnings.title')}
      description={t('earnings.description')}
    >
      <ClubPointTabs tabs={tabs} search={search} navigate={navigate} />
      <EntityDataTable
        data={data?.data ?? []}
        meta={data?.meta}
        search={search}
        navigate={navigate}
        columns={columns}
        searchPlaceholder={t('earnings.search')}
        noResultsMessage={t('earnings.empty')}
        enableRowSelection={false}
        enableStatusFilter={false}
        defaultSort='created_at'
      />
      <ClubPointLinesDialog
        earning={viewing}
        onClose={() => setViewing(null)}
      />
    </AdminPageShell>
  )
}
