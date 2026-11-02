import { ArrowUpRight, DollarSign, Package, ShoppingCart, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ReportsOverview } from '../data/reports.type'

interface ReportStatCardsProps {
  overview?: ReportsOverview
}

export function ReportStatCards({ overview }: ReportStatCardsProps) {
  const stats = [
    {
      title: 'Ümumi Dövriyyə',
      value: `${(overview?.total_revenue ?? 0).toLocaleString()} ₼`,
      icon: DollarSign,
      color: 'text-emerald-600',
    },
    {
      title: 'Admin Qazancı',
      value: `${(overview?.admin_earnings ?? 0).toLocaleString()} ₼`,
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: 'Satıcı Ödənişləri',
      value: `${(overview?.seller_earnings ?? 0).toLocaleString()} ₼`,
      icon: ArrowUpRight,
      color: 'text-amber-600',
    },
    {
      title: 'Sifariş Sayı',
      value: (overview?.total_orders ?? 0).toLocaleString(),
      icon: ShoppingCart,
      color: 'text-purple-600',
    },
    {
      title: 'Daxili Satışlar',
      value: `${(overview?.total_in_house_sales ?? 0).toLocaleString()} ₼`,
      icon: Package,
      color: 'text-sky-600',
    },
    {
      title: 'Balans Yükləmələri',
      value: `${(overview?.wallet_recharge_total ?? 0).toLocaleString()} ₼`,
      icon: Wallet,
      color: 'text-teal-600',
    },
  ]

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'>
      {stats.map((s) => {
        const Icon = s.icon
        return (
          <Card key={s.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-xs font-medium text-muted-foreground'>
                {s.title}
              </CardTitle>
              <Icon className={`size-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className='text-lg font-bold'>{s.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
