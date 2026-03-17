import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function RuleStatistics() {
  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-3xl font-bold'>规则统计</h1>
        <p className='text-muted-foreground'>查看规则的统计信息和分析数据</p>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>总规则数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>128</div>
            <p className='text-xs text-muted-foreground'>+12% 较上月</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>活跃规则</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>95</div>
            <p className='text-xs text-muted-foreground'>74% 启用率</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>今日执行</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,234</div>
            <p className='text-xs text-muted-foreground'>+8% 较昨日</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>错误率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>0.5%</div>
            <p className='text-xs text-muted-foreground'>-0.2% 较昨日</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>规则执行趋势</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[300px] flex items-center justify-center text-muted-foreground'>
            图表区域 - 可集成 recharts 或其他图表库
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/rules/statistics')({
  component: RuleStatistics,
})
