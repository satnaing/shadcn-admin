import {
  shopLeaderboardData,
  salesTrendData,
} from '@/features/hq/data/mock-hq-dashboard'
import { SalesTrend } from './sales-trend'
import { ShopLeaderboard } from './shop-leaderboard'
import { StatsCards } from './stats-cards'

export function HqDashboard() {
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold tracking-tight'>
          Head Office Overview
        </h1>
      </div>

      <StatsCards />

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-7'>
        <div className='col-span-4 min-h-[400px] rounded-xl border bg-card text-card-foreground shadow'>
          <div className='flex h-full flex-col p-6'>
            <h3 className='mb-4 leading-none font-semibold tracking-tight'>
              Sales Trend (Description: Hourly Sales of Top 3 Shops)
            </h3>
            <div className='min-h-0 w-full flex-1'>
              <SalesTrend data={salesTrendData} />
            </div>
          </div>
        </div>
        <div className='col-span-3 flex min-h-[400px] flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow'>
          <div className='p-6 pb-0'>
            <h3 className='mb-4 leading-none font-semibold tracking-tight'>
              Shop Leaderboard
            </h3>
          </div>
          <div className='flex-1 overflow-visible p-6 pt-0'>
            <ShopLeaderboard data={shopLeaderboardData} />
          </div>
        </div>
      </div>
    </div>
  )
}
