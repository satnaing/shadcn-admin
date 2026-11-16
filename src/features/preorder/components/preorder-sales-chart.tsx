import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

/** Loaded lazily (recharts is heavy) via preorder-sales-chart-card.tsx. */
export default function PreorderSalesChart({ data }: { data: number[] }) {
  const points = data.map((total, i) => ({ month: MONTHS[i], total }))

  return (
    <ResponsiveContainer width='100%' height={260}>
      <BarChart data={points}>
        <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
        <XAxis
          dataKey='month'
          tickLine={false}
          axisLine={false}
          fontSize={12}
        />
        <YAxis tickLine={false} axisLine={false} fontSize={12} width={48} />
        <Tooltip />
        <Bar dataKey='total' className='fill-primary' radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
