import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function RuleLogs() {
  const logs = [
    {
      id: 1,
      timestamp: '2026-03-17 14:32:15',
      rule: '用户登录验证',
      action: '执行成功',
      level: 'success',
      user: 'admin@example.com',
      details: '用户登录验证通过，IP: 192.168.1.100',
    },
    {
      id: 2,
      timestamp: '2026-03-17 14:30:42',
      rule: '数据访问权限',
      action: '执行失败',
      level: 'error',
      user: 'user@example.com',
      details: '权限不足，无法访问敏感数据',
    },
    {
      id: 3,
      timestamp: '2026-03-17 14:28:33',
      rule: '文件上传限制',
      action: '执行成功',
      level: 'success',
      user: 'editor@example.com',
      details: '文件大小验证通过，允许上传',
    },
    {
      id: 4,
      timestamp: '2026-03-17 14:25:18',
      rule: 'API 调用频率',
      action: '触发警告',
      level: 'warning',
      user: 'api_user@example.com',
      details: 'API 调用频率接近限制阈值',
    },
    {
      id: 5,
      timestamp: '2026-03-17 14:20:05',
      rule: '数据导出审计',
      action: '执行成功',
      level: 'info',
      user: 'admin@example.com',
      details: '导出 500 条用户数据记录',
    },
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'default'
      case 'error':
        return 'destructive'
      case 'warning':
        return 'outline'
      case 'info':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'success':
        return '成功'
      case 'error':
        return '错误'
      case 'warning':
        return '警告'
      case 'info':
        return '信息'
      default:
        return level
    }
  }

  return (
    <div className='space-y-4'>
      <div>
        <h1 className='text-3xl font-bold'>规则日志</h1>
        <p className='text-muted-foreground'>查看规则执行的详细日志记录</p>
      </div>

      <div className='flex items-center gap-2'>
        <Input placeholder='搜索日志...' className='max-w-sm' />
        <Button variant='outline'>筛选</Button>
        <Button variant='outline'>导出</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>最近日志</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {logs.map((log) => (
              <div
                key={log.id}
                className='flex items-start gap-4 rounded-lg border p-4'
              >
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-medium'>{log.rule}</span>
                    <Badge variant={getLevelColor(log.level)}>
                      {getLevelText(log.level)}
                    </Badge>
                  </div>
                  <p className='text-sm text-muted-foreground'>{log.details}</p>
                  <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                    <span>{log.timestamp}</span>
                    <span>•</span>
                    <span>用户: {log.user}</span>
                  </div>
                </div>
                <Button variant='ghost' size='sm'>
                  详情
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/rules/logs')({
  component: RuleLogs,
})
