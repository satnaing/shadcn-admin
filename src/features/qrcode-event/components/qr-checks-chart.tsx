import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { StatsResponse } from '../data/qrcode-event.type'

/** Loaded lazily (recharts is heavy) via qr-checks-chart-card.tsx. */
export default function QrChecksChart({ data }: { data: StatsResponse['chart'] }) {
  return (
    <ResponsiveContainer width='100%' height={260}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
        <XAxis dataKey='day' tickLine={false} axisLine={false} fontSize={12} />
        <YAxis tickLine={false} axisLine={false} fontSize={12} width={32} allowDecimals={false} />
        <Tooltip />
        <Area type='monotone' dataKey='total' className='fill-primary/20 stroke-primary' />
        <Area type='monotone' dataKey='wins' className='fill-emerald-500/30 stroke-emerald-600' />
      </AreaChart>
    </ResponsiveContainer>
  )
}
