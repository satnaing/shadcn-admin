import { useEffect, useState } from 'react'
import { Coffee, DollarSign, Receipt, Users } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface KpiData {
  sales: {
    cpd: number
    asp: number
    grossContribution: number
    aov: number
    discountBleedPct: number
  }
  acquisition: {
    newSignups: number
  }
}

export function StatsCards() {
  const [data, setData] = useState<KpiData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKpi = async () => {
      try {
        const { data: json } = await apiClient.get<KpiData>(
          'admin/reports/dashboard/kpi'
        )
        setData(json)
      } catch {
        // silently handle fetch errors
      } finally {
        setLoading(false)
      }
    }

    fetchKpi()
  }, [])

  if (loading) {
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
          <div className='text-2xl font-bold'>{data?.sales?.cpd ?? '—'}</div>
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
          <div className='text-2xl font-bold'>
            ${data?.sales?.asp?.toFixed(2) ?? '—'}
          </div>
          <p className='text-xs text-muted-foreground'>
            Gross Contribution:{' '}
            <span className='text-emerald-500'>
              ${data?.sales?.grossContribution?.toFixed(2) ?? '—'} / cup
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
          <div className='text-2xl font-bold'>
            ${data?.sales?.aov?.toFixed(2) ?? '—'}
          </div>
          <p className='text-xs text-muted-foreground'>
            Discount Bleed:{' '}
            <span className='text-rose-500'>
              {data?.sales?.discountBleedPct ?? '—'}%
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
            +{data?.acquisition?.newSignups ?? '—'}
          </div>
          <p className='text-xs text-muted-foreground'>Registered today</p>
        </CardContent>
      </Card>
    </div>
  )
}
