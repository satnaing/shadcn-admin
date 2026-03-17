import { useState } from 'react'
import { toast } from 'sonner'
import { FileText } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ruleVersions } from './data/rule-versions'
import { scenarios } from './data/scenarios'
import { type RuleVersion } from './data/schema'
import { RuleVersionsTable } from './components/rule-versions-table'

export function RuleVersions() {
  const [data, setData] = useState<RuleVersion[]>(ruleVersions)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<RuleVersion | null>(null)
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0].id)

  const currentScenario = scenarios.find((s) => s.id === selectedScenario)


  const handleEdit = (row: RuleVersion) => {
    toast.info(`编辑规则: ${row.ruleNumber}`)
    // 这里可以打开编辑对话框或跳转到编辑页面
  }

  const handleDelete = (row: RuleVersion) => {
    setSelectedRule(row)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = (row: RuleVersion, newStatus: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === row.id
          ? { ...item, versionStatus: newStatus as RuleVersion['versionStatus'] }
          : item
      )
    )
    const statusLabel = {
      enabled: '开启',
      observing: '观察',
      disabled: '关闭',
    }[newStatus]
    toast.success(`规则 ${row.ruleNumber} 状态已更新为: ${statusLabel}`)
  }

  const handleCreateNew = () => {
    toast.info('创建新规则')
    // 这里可以打开创建对话框或跳转到创建页面
  }

  const confirmDelete = () => {
    if (selectedRule) {
      toast.success(`已删除规则: ${selectedRule.ruleNumber}`)
      // 这里执行实际的删除操作
    }
    setDeleteDialogOpen(false)
    setSelectedRule(null)
  }

  return (
    <div className='space-y-6'>
      {/* 页面标题 */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>规则版本</h1>
          <p className='mt-2 text-muted-foreground'>
            管理和查看规则的版本信息,支持多场景配置
          </p>
        </div>
      </div>

      {/* 场景选择器 */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <FileText className='size-5' />
            场景配置
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='scenario-select'>选择场景</Label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger id='scenario-select'>
                  <SelectValue placeholder='请选择场景' />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((scenario) => (
                    <SelectItem key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='scenario-code'>场景编号</Label>
              <Input
                id='scenario-code'
                value={currentScenario?.code || ''}
                readOnly
                className='bg-muted font-mono'
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 规则表格 */}
      <Card>
        <CardContent className='pt-6'>
          <RuleVersionsTable
            data={data}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onCreateNew={handleCreateNew}
          />
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除规则 <span className='font-semibold'>{selectedRule?.ruleNumber}</span> 吗？
              此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
