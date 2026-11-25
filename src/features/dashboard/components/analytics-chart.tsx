import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'

export function AnalyticsChart() {
  const { t } = useTranslation('dashboard')
  const data = [
    {
      name: t('days.mon'),
      clicks: Math.floor(Math.random() * 900) + 100,
      uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
      name: t('days.tue'),
      clicks: Math.floor(Math.random() * 900) + 100,
      uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
      name: t('days.wed'),
      clicks: Math.floor(Math.random() * 900) + 100,
      uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
      name: t('days.thu'),
      clicks: Math.floor(Math.random() * 900) + 100,
      uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
      name: t('days.fri'),
      clicks: Math.floor(Math.random() * 900) + 100,
      uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
      name: t('days.sat'),
      clicks: Math.floor(Math.random() * 900) + 100,
      uniques: Math.floor(Math.random() * 700) + 80,
    },
    {
      name: t('days.sun'),
      clicks: Math.floor(Math.random() * 900) + 100,
      uniques: Math.floor(Math.random() * 700) + 80,
    },
  ]
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
