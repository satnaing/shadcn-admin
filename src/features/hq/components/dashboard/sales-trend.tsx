import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface RevenueTrendItem {
  date: string
  grossSales: number
  netRevenue: number
}

interface SalesTrendProps {
  data: RevenueTrendItem[]
}

export function SalesTrend({ data }: SalesTrendProps) {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id='colorNet' x1='0' y1='0' x2='0' y2='1'>
            <stop
              offset='5%'
              stopColor='hsl(var(--primary))'
              stopOpacity={0.1}
            />
            <stop
              offset='95%'
              stopColor='hsl(var(--primary))'
              stopOpacity={0}
            />
          </linearGradient>
          <linearGradient id='colorGross' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='#10b981' stopOpacity={0.1} />
            <stop offset='95%' stopColor='#10b981' stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray='3 3'
          vertical={false}
          strokeOpacity={0.5}
        />
        <XAxis
          dataKey='date'
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
          }}
          itemStyle={{ fontSize: '12px' }}
        />
        <Area
          type='monotone'
          dataKey='grossSales'
          stroke='hsl(var(--muted-foreground))'
          fillOpacity={0.1}
          fill='hsl(var(--muted-foreground))'
          strokeWidth={2}
          name='Gross Sales'
        />
        <Area
          type='monotone'
          dataKey='netRevenue'
          stroke='#10b981'
          fillOpacity={0.2}
          fill='#10b981'
          strokeWidth={2}
          name='Net Revenue'
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
