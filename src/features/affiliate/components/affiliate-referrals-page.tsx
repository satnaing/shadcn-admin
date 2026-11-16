import { useMemo } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import { translatedColumnHeader } from '@/components/data-table/column-header'
import type { ReferralItem } from '../data/affiliate.type'
import { AffiliateList } from './affiliate-list'

const h = (key: string) =>
  translatedColumnHeader<ReferralItem, unknown>(`affiliate:columns.${key}`)

interface Props {
  search: Record<string, unknown>
  navigate: NavigateFn
}

/** Customers who registered through a referral link and who referred them. */
export function AffiliateReferralsPage({ search, navigate }: Props) {
  const { t } = useTranslation('affiliate')
  const columns = useMemo<ColumnDef<ReferralItem>[]>(
    () => [
      { accessorKey: 'name', ...h('name') },
      { accessorKey: 'phone', ...h('phone') },
      { accessorKey: 'email', ...h('email') },
      {
        accessorKey: 'referred_by_name',
        ...h('referredBy'),
        cell: ({ row }) =>
          row.original.referred_by_name ?? (
            <span className='text-muted-foreground'>
              {t('referrals.deleted')}
            </span>
          ),
      },
    ],
    [t]
  )

  return (
    <AffiliateList
      kind='referrals'
      columns={columns}
      defaultSort='id'
      search={search}
      navigate={navigate}
    />
  )
}
