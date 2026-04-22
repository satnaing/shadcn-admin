import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { name: 'Jan', revenue: 4200, expenses: 2800 },
  { name: 'Feb', revenue: 3800, expenses: 2600 },
  { name: 'Mar', revenue: 5100, expenses: 3200 },
  { name: 'Apr', revenue: 4600, expenses: 2900 },
  { name: 'May', revenue: 5400, expenses: 3100 },
  { name: 'Jun', revenue: 6200, expenses: 3400 },
  { name: 'Jul', revenue: 5800, expenses: 3600 },
  { name: 'Aug', revenue: 6800, expenses: 3800 },
  { name: 'Sep', revenue: 6100, expenses: 3500 },
  { name: 'Oct', revenue: 7200, expenses: 4000 },
  { name: 'Nov', revenue: 6900, expenses: 3900 },
  { name: 'Dec', revenue: 7800, expenses: 4200 },
]

export function ReportsChart() {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          direction='ltr'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
          labelFormatter={(label) => `Month: ${label}`}
        />
        <Bar
          dataKey='revenue'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
        <Bar
          dataKey='expenses'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-muted-foreground/50'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
