import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { SalesTrend } from './sales-trend'
import { ShopLeaderboard } from './shop-leaderboard'
import { StatsCards } from './stats-cards'

export interface HqKpiData {
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
  revenueTrend: {
    date: string
    grossSales: number
    netRevenue: number
  }[]
  topProducts: {
    name: string
    quantity: number
    revenue: number
  }[]
}

export function HqDashboard() {
  const [data, setData] = useState<HqKpiData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKpi = async () => {
      try {
        const { data: json } = await apiClient.get<HqKpiData>(
          'admin/hq/reports/kpi'
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

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>
          Head Office Overview
        </h1>
      </div>

      <StatsCards data={data} loading={loading} />

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
        <div className='col-span-4 min-h-[400px] rounded-xl border bg-card text-card-foreground shadow'>
          <div className='flex h-full flex-col p-6'>
            <h3 className='mb-4 leading-none font-semibold tracking-tight'>
              Gross vs. Net Revenue (14 Days)
            </h3>
            <div className='min-h-0 w-full flex-1'>
              <SalesTrend data={data?.revenueTrend ?? []} />
            </div>
          </div>
        </div>
        <div className='col-span-3 flex min-h-[400px] flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow'>
          <div className='p-6 pb-0'>
            <h3 className='mb-4 leading-none font-semibold tracking-tight'>
              Top Selling Products
            </h3>
          </div>
          <div className='flex-1 overflow-visible p-6 pt-0'>
            <ShopLeaderboard data={data?.topProducts ?? []} />
          </div>
        </div>
      </div>
    </div>
  )
}
