import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const data = [
  {
    name: 'Mon',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Tue',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Wed',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Thu',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Fri',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Sat',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
  {
    name: 'Sun',
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  },
]

export function AnalyticsChart() {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Area
          type='monotone'
          dataKey='clicks'
          stroke='currentColor'
          className='text-primary'
          fill='currentColor'
          fillOpacity={0.15}
        />
        <Area
          type='monotone'
          dataKey='uniques'
          stroke='currentColor'
          className='text-muted-foreground'
          fill='currentColor'
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
