import { Coffee, DollarSign, Receipt, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { HqKpiData } from './index'

interface StatsCardsProps {
  data: HqKpiData | null
  loading: boolean
}

export function StatsCards({ data, loading }: StatsCardsProps) {
  if (loading || !data) {
    return (
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-4 w-4 rounded' />
            </CardHeader>
            <CardContent>
              <Skeleton className='mb-2 h-7 w-20' />
              <Skeleton className='h-3 w-40' />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {/* Card 1: Cups Per Day */}
      <Card className='py-2'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Cups Per Day (CPD)
          </CardTitle>
          <Coffee className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{data.sales.cpd}</div>
          <p className='text-xs text-muted-foreground'>
            Total beverage volume today
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Avg Selling Price */}
      <Card className='py-2'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Avg Selling Price
          </CardTitle>
          <DollarSign className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>${data.sales.asp.toFixed(2)}</div>
          <p className='text-xs text-muted-foreground'>
            Gross Contribution:{' '}
            <span className='text-emerald-500'>
              ${data.sales.grossContribution.toFixed(2)} / cup
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Avg Order Value */}
      <Card className='py-2'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Avg Order Value</CardTitle>
          <Receipt className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>${data.sales.aov.toFixed(2)}</div>
          <p className='text-xs text-muted-foreground'>
            Discount Bleed:{' '}
            <span className='text-rose-500'>
              {data.sales.discountBleedPct.toFixed(1)}%
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Card 4: New Accounts */}
      <Card className='py-2'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>New Accounts</CardTitle>
          <Users className='h-4 w-4 text-muted-foreground' />
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>
            +{data.acquisition.newSignups}
          </div>
          <p className='text-xs text-muted-foreground'>Registered today</p>
        </CardContent>
      </Card>
    </div>
  )
}
