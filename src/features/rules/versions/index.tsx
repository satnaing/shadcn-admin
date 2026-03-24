import { useEffect, useState } from 'react'
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
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/stores/auth-store'
import { type RuleVersion } from './data/schema'
import { RuleVersionsTable } from './components/rule-versions-table'
import { RuleEditDialog } from './components/rule-edit-dialog'
import { RuleCreateDialog } from './components/rule-create-dialog'
import { fetchProjs, fetchRules, createRule, updateRule, updateRuleStatus, deleteRule, type Proj } from './api'

export function RuleVersions() {
  const [data, setData] = useState<RuleVersion[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedRule, setSelectedRule] = useState<RuleVersion | null>(null)
  const [projs, setProjs] = useState<Proj[]>([])
  const [selectedScenario, setSelectedScenario] = useState<string | undefined>(undefined)
  const user = useAuthStore((s) => s.auth.user)

  useEffect(() => {
    if (!user?.user_id) return
    fetchProjs(user.user_id)
      .then((list) => {
        setProjs(list)
        if (list.length > 0) setSelectedScenario(list[0].proj_id)
      })
      .catch(() => toast.error('获取场景列表失败'))
  }, [user?.user_id])

  useEffect(() => {
    if (!user?.user_id || !selectedScenario) return
    fetchRules(user.user_id, selectedScenario)
      .then(setData)
      .catch(() => toast.error('获取规则列表失败'))
  }, [user?.user_id, selectedScenario])

  const currentScenario = projs.find((s) => s.proj_id === selectedScenario)

  const handleEdit = (row: RuleVersion) => {
    setSelectedRule(row)
    setEditDialogOpen(true)
  }

  const handleEditConfirm = (ruleId: string, fields: { rule_name: string; rule_desc: string; rule_graph?: string }) => {
    if (!selectedRule) return
    updateRule(user!.user_id, selectedRule.proj_id, ruleId, fields)
      .then(() => {
        setData((d) =>
          d.map((item) => item.rule_id === ruleId ? { ...item, ...fields } : item)
        )
        toast.success('规则已更新')
        setEditDialogOpen(false)
        setSelectedRule(null)
      })
      .catch(() => toast.error('更新失败，请重试'))
  }

  const handleDelete = (row: RuleVersion) => {
    setSelectedRule(row)
    setDeleteDialogOpen(true)
  }

  const handleStatusChange = (row: RuleVersion, newStatus: string) => {
    const prevData = data
    setData((d) =>
      d.map((item) =>
        item.rule_id === row.rule_id
          ? { ...item, rule_status: newStatus as RuleVersion['rule_status'] }
          : item
      )
    )
    updateRuleStatus(user!.user_id, row.proj_id, row.rule_id, newStatus)
      .then(() => {
        const label = { active: '开启', watch: '观察', close: '关闭' }[newStatus]
        toast.success(`规则 ${row.rule_id} 状态已更新为: ${label}`)
        // active 时后端会把同 proj 其他 active 规则关闭，重新拉取保持同步
        if (newStatus === 'active' && selectedScenario) {
          fetchRules(user!.user_id, selectedScenario).then(setData).catch(() => {})
        }
      })
      .catch(() => {
        setData(prevData)
        toast.error('状态更新失败，已回滚')
      })
  }

  const handleCreateNew = () => {
    setCreateDialogOpen(true)
  }

  const handleCreateConfirm = (fields: { rule_name: string; rule_desc: string; rule_graph: string }) => {
    if (!selectedScenario) return
    createRule(user!.user_id, selectedScenario, fields)
      .then(() => {
        toast.success('规则创建成功')
        setCreateDialogOpen(false)
        return fetchRules(user!.user_id, selectedScenario)
      })
      .then(setData)
      .catch(() => toast.error('创建失败，请重试'))
  }

  const confirmDelete = () => {
    if (!selectedRule) return
    deleteRule(user!.user_id, selectedRule.rule_id)
      .then(() => {
        setData((d) => d.filter((item) => item.rule_id !== selectedRule.rule_id))
        toast.success(`已删除规则: ${selectedRule.rule_id}`)
      })
      .catch(() => toast.error('删除失败，请先关闭规则后再删除'))
      .finally(() => {
        setDeleteDialogOpen(false)
        setSelectedRule(null)
      })
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
        <CardContent className='pt-2'>
          <div className='flex items-center gap-6'>
            <div className='flex items-center gap-2'>
              <FileText className='size-5 text-muted-foreground' />
              <span className='text-sm font-medium'>场景配置</span>
            </div>
            <div className='flex flex-1 items-center gap-6'>
              <div className='flex items-center gap-3'>
                <Label htmlFor='scenario-select' className='text-sm text-muted-foreground'>选择场景</Label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger id='scenario-select' className='w-48'>
                    <SelectValue placeholder='请选择场景' />
                  </SelectTrigger>
                  <SelectContent>
                    {projs.map((proj) => (
                      <SelectItem key={proj.proj_id} value={proj.proj_id}>
                        {proj.proj_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='flex items-center gap-3'>
                <Label htmlFor='scenario-code' className='text-sm text-muted-foreground'>场景编号</Label>
                <Input
                  id='scenario-code'
                  value={currentScenario?.proj_id || ''}
                  readOnly
                  className='w-64 bg-muted/50 font-mono text-sm'
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 规则表格 */}
      <Card>
        <CardContent className='pt-2'>
          <RuleVersionsTable
            data={data}
            userId={user?.user_id ?? ''}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            onCreateNew={handleCreateNew}
            projId={selectedScenario}
          />
        </CardContent>
      </Card>

      <RuleCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onConfirm={handleCreateConfirm}
      />

      <RuleEditDialog
        rule={selectedRule}
        open={editDialogOpen}
        userId={user?.user_id ?? ''}
        projId={selectedRule?.proj_id ?? ''}
        onOpenChange={setEditDialogOpen}
        onConfirm={handleEditConfirm}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除规则 <span className='font-semibold'>{selectedRule?.rule_id}</span> 吗？
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
