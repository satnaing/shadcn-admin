import { useTranslation } from 'react-i18next'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

const months = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
] as const

export function Overview() {
  const { t } = useTranslation('dashboard')

  const data = months.map((m) => ({
    name: t(m),
    total: Math.floor(Math.random() * 5000) + 1000,
  }))

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
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
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
