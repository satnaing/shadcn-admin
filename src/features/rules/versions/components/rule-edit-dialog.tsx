import { useEffect, useRef, useState } from 'react'
import { Download, Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type RuleVersion } from '../data/schema'
import { fetchRuleDetail } from '../api'

type Props = {
  rule: RuleVersion | null
  open: boolean
  userId: string
  projId: string
  onOpenChange: (open: boolean) => void
  onConfirm: (ruleId: string, fields: { rule_name: string; rule_desc: string; rule_graph?: string }) => void
}

export function RuleEditDialog({ rule, open, userId, projId, onOpenChange, onConfirm }: Props) {
  const [ruleName, setRuleName] = useState('')
  const [ruleDesc, setRuleDesc] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [fileName, setFileName] = useState('')
  const [ruleGraph, setRuleGraph] = useState('')
  const [fileError, setFileError] = useState('')
  const [loadingGraph, setLoadingGraph] = useState(false)
  const [originalGraph, setOriginalGraph] = useState<unknown>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!rule || !open) return
    setRuleName(rule.rule_name)
    setRuleDesc(rule.rule_desc)
    setFileName('')
    setRuleGraph('')
    setFileError('')
    setOriginalGraph(null)
    setLoadingGraph(true)
    fetchRuleDetail(userId, projId, rule.rule_id)
      .then((detail) => setOriginalGraph(detail.rule_graph))
      .catch(() => toast.error('加载规则图失败'))
      .finally(() => setLoadingGraph(false))
  }, [rule, open])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      try {
        JSON.parse(text)
        setRuleGraph(text)
        setFileName(file.name)
      } catch {
        setFileError('文件内容不是合法的 JSON，请重新选择')
        setRuleGraph('')
        setFileName('')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleClearFile = () => {
    setRuleGraph('')
    setFileName('')
    setFileError('')
  }

  const handleConfirm = () => {
    if (!rule) return
    onConfirm(rule.rule_id, {
      rule_name: ruleName,
      rule_desc: ruleDesc,
      ...(ruleGraph ? { rule_graph: ruleGraph } : {}),
    })
  }

  const handleDownload = () => {
    if (!rule) return
    setDownloading(true)
    fetchRuleDetail(userId, projId, rule.rule_id)
      .then((detail) => {
        const content = JSON.stringify(detail.rule_graph, null, 2)
        const blob = new Blob([content], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${rule.rule_id}.json`
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch(() => toast.error('下载失败，请重试'))
      .finally(() => setDownloading(false))
  }

  // 预览内容：上传了新文件则显示新文件，否则显示原始 rule_graph
  const previewJson = ruleGraph
    ? JSON.stringify(JSON.parse(ruleGraph), null, 2)
    : originalGraph !== null
      ? JSON.stringify(originalGraph, null, 2)
      : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] flex-col sm:max-w-[640px]'>
        <DialogHeader>
          <DialogTitle>编辑规则</DialogTitle>
        </DialogHeader>
        <div className='flex-1 space-y-4 overflow-y-auto py-2 pr-1'>
          <div className='space-y-2'>
            <Label htmlFor='edit-rule-id'>规则编号</Label>
            <div className='flex gap-2'>
              <Input
                id='edit-rule-id'
                value={rule?.rule_id || ''}
                readOnly
                className='bg-muted font-mono'
              />
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={handleDownload}
                disabled={downloading}
                title='下载规则图 JSON'
              >
                {downloading ? <Loader2 className='size-4 animate-spin' /> : <Download className='size-4' />}
              </Button>
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='edit-rule-name'>规则名称</Label>
            <Input
              id='edit-rule-name'
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder='请输入规则名称'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='edit-rule-desc'>规则描述</Label>
            <Textarea
              id='edit-rule-desc'
              value={ruleDesc}
              onChange={(e) => setRuleDesc(e.target.value)}
              placeholder='请输入规则描述'
              rows={3}
            />
          </div>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Label>规则图</Label>
              <div className='flex items-center gap-2'>
                {fileName && (
                  <span className='max-w-[160px] truncate text-xs text-muted-foreground'>{fileName}</span>
                )}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='.json'
                  className='hidden'
                  onChange={handleFile}
                />
                {fileName ? (
                  <Button type='button' variant='ghost' size='sm' onClick={handleClearFile} className='h-7 px-2 text-xs'>
                    <X className='mr-1 size-3' />
                    清除
                  </Button>
                ) : (
                  <Button type='button' variant='outline' size='sm' className='h-7 px-2 text-xs' onClick={() => fileInputRef.current?.click()}>
                    <Upload className='mr-1 size-3' />
                    上传 JSON
                  </Button>
                )}
              </div>
            </div>
            {fileError && <p className='text-xs text-destructive'>{fileError}</p>}
            <div className='relative min-h-[160px] overflow-hidden rounded-md border bg-muted'>
              {loadingGraph ? (
                <div className='flex h-40 items-center justify-center'>
                  <Loader2 className='size-5 animate-spin text-muted-foreground' />
                </div>
              ) : previewJson !== null ? (
                <pre className='max-h-[320px] overflow-auto p-3 text-xs leading-relaxed'>
                  {previewJson}
                </pre>
              ) : (
                <div className='flex h-40 items-center justify-center text-sm text-muted-foreground'>
                  暂无规则图数据
                </div>
              )}
              {fileName && (
                <div className='absolute right-2 top-2 rounded bg-blue-500/10 px-1.5 py-0.5 text-xs text-blue-600 dark:text-blue-400'>
                  已替换
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>取消</Button>
          <Button onClick={handleConfirm} disabled={!!fileError}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
