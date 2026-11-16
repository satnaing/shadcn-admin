import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import { type AffiliateLogItem, LOG_TABS } from '../data/affiliate.type'
import { AffiliateBadge } from './affiliate-badge'
import { AffiliateList } from './affiliate-list'

const h = (key: string) =>
  translatedColumnHeader<AffiliateLogItem, unknown>(`affiliate:columns.${key}`)

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Every commission the system credited: who earned it, from whom, for which order and why. */
export function AffiliateLogsPage({ search, navigate }: Props) {
  const { t } = useTranslation('affiliate')
  const { formatMoney } = useCurrencyFormatter()
  const tabs = LOG_TABS.map((value) => ({
    value,
    label: t(value === 'all' ? 'tabs.all' : `type.${value}`),
  }))
  const columns = useMemo<ColumnDef<AffiliateLogItem>[]>(
    () => [
      { accessorKey: 'referred_by_name', ...h('referredBy') },
      {
        accessorKey: 'referral_name',
        ...h('referral'),
        cell: ({ row }) =>
          row.original.referral_name ??
          t('logs.guest', { id: row.original.guest_id }),
      },
      {
        accessorKey: 'amount',
        ...h('amount'),
        cell: ({ row }) => formatMoney(row.original.amount),
      },
      {
        accessorKey: 'order_code',
        ...h('order'),
        cell: ({ row }) => `#${row.original.order_code}`,
      },
      {
        accessorKey: 'affiliate_type',
        enableSorting: false,
        ...h('type'),
        cell: ({ row }) => (
          <AffiliateBadge group='type' value={row.original.affiliate_type} />
        ),
      },
      {
        accessorKey: 'product_name',
        ...h('product'),
        cell: ({ row }) =>
          row.original.product_name ?? (
            <span className='text-muted-foreground'>—</span>
          ),
      },
      {
        accessorKey: 'created_at',
        ...h('date'),
        cell: ({ row }) => row.original.created_at.slice(0, 10),
      },
    ],
    [t, formatMoney]
  )

  return (
    <AffiliateList
      kind='logs'
      columns={columns}
      tabs={tabs}
      defaultSort='created_at'
      search={search}
      navigate={navigate}
    />
  )
}
