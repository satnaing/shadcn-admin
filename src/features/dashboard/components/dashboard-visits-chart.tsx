import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DashboardVisitPoint } from '../data/dashboard.type'

/** Loaded lazily (recharts is heavy) via dashboard-chart-card.tsx. */
export default function DashboardVisitsChart({ data }: { data: DashboardVisitPoint[] }) {
  return (
    <ResponsiveContainer width='100%' height={260}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
        <XAxis dataKey='date' tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
        <Tooltip />
        <Area type='monotone' dataKey='pageviews' className='fill-primary/10 stroke-primary/40' />
        <Area type='monotone' dataKey='visits' className='fill-primary/30 stroke-primary' />
      </AreaChart>
    </ResponsiveContainer>
  )
}
