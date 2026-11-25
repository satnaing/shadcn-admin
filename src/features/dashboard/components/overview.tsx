import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'

export function Overview() {
  const { t } = useTranslation('dashboard')
  const data = [
    { name: t('months.jan'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.feb'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.mar'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.apr'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.may'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.jun'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.jul'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.aug'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.sep'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.oct'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.nov'), total: Math.floor(Math.random() * 5000) + 1000 },
    { name: t('months.dec'), total: Math.floor(Math.random() * 5000) + 1000 },
  ]
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
          direction='ltr'
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
