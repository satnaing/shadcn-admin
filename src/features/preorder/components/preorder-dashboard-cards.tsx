import { Link } from '@tanstack/react-router'
import { useCurrencyFormatter } from '@/shared/hooks/useCurrencyFormatter'
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import type { DashboardStats } from '../data/preorder.type'

const MONEY = ['inhouse_sales', 'seller_sales', 'month_sales'] as const
/** stat → orders list filter the card links to (counters open the matching list). */
const LINKS: Record<string, { scope?: string; stage?: string }> = {
  requests: { stage: 'requested' },
  accepted_requests: { stage: 'accepted_requests' },
  prepayment_requests: { stage: 'prepayment_requests' },
  confirmed_prepayments: { stage: 'confirmed_prepayments' },
  final_preorders: { stage: 'final_preorders' },
  in_shipping: { stage: 'in_shipping' },
  delivered: { stage: 'delivered' },
  delayed_prepayment: { scope: 'delayed_prepayment' },
  delayed_final: { scope: 'delayed_final' },
}
const COUNTS = [
  'products_total',
  'products_live',
  ...Object.keys(LINKS),
] as const

export function PreorderDashboardCards({ stats }: { stats: DashboardStats }) {
  const { t } = useTranslation('preorder')
  const { formatMoney } = useCurrencyFormatter()
  const card = (
    key: string,
    value: string | number,
    link?: { scope?: string; stage?: string }
  ) => {
    const body = (
      <Card
        className={link ? 'transition-colors hover:bg-muted/50' : undefined}
      >
        <CardContent className='space-y-1'>
          <p className='text-sm text-muted-foreground'>
            {t(`dashboard.${key}`)}
          </p>
          <p className='text-2xl font-bold'>{value}</p>
        </CardContent>
      </Card>
    )

    return link ? (
      <Link key={key} to='/admin/preorder/orders' search={link}>
        {body}
      </Link>
    ) : (
      <div key={key}>{body}</div>
    )
  }

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {MONEY.map((k) => card(k, formatMoney(stats[k])))}
      {COUNTS.map((k) =>
        card(k, stats[k as keyof DashboardStats] as number, LINKS[k])
      )}
    </div>
  )
}
