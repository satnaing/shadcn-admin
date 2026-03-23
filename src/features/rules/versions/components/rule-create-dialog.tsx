import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
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

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (fields: { rule_name: string; rule_desc: string; rule_graph: string }) => void
}

export function RuleCreateDialog({ open, onOpenChange, onConfirm }: Props) {
  const [ruleName, setRuleName] = useState('')
  const [ruleDesc, setRuleDesc] = useState('')
  const [fileName, setFileName] = useState('')
  const [ruleGraph, setRuleGraph] = useState('')
  const [fileError, setFileError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    if (!ruleName.trim()) return
    if (!ruleGraph) {
      setFileError('请选择一个 JSON 文件')
      return
    }
    onConfirm({ rule_name: ruleName.trim(), rule_desc: ruleDesc.trim(), rule_graph: ruleGraph })
  }

  const handleOpenChange = (v: boolean) => {
    if (!v) {
      setRuleName('')
      setRuleDesc('')
      setFileName('')
      setRuleGraph('')
      setFileError('')
    }
    onOpenChange(v)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-[480px]'>
        <DialogHeader>
          <DialogTitle>创建规则</DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-2'>
          <div className='space-y-2'>
            <Label htmlFor='create-rule-name'>规则名称</Label>
            <Input
              id='create-rule-name'
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder='请输入规则名称'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='create-rule-desc'>规则描述</Label>
            <Textarea
              id='create-rule-desc'
              value={ruleDesc}
              onChange={(e) => setRuleDesc(e.target.value)}
              placeholder='请输入规则描述'
              rows={3}
            />
          </div>
          <div className='space-y-2'>
            <Label>规则图（JSON 文件，可选）</Label>
            <input
              ref={fileInputRef}
              type='file'
              accept='.json'
              className='hidden'
              onChange={handleFile}
            />
            {fileName ? (
              <div className='flex items-center gap-2 rounded-md border px-3 py-2 text-sm'>
                <span className='flex-1 truncate text-muted-foreground'>{fileName}</span>
                <button
                  type='button'
                  onClick={handleClearFile}
                  className='text-muted-foreground hover:text-foreground'
                >
                  <X className='size-4' />
                </button>
              </div>
            ) : (
              <Button
                type='button'
                variant='outline'
                className='w-full'
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className='mr-2 size-4' />
                选择 JSON 文件
              </Button>
            )}
            {fileError && <p className='text-xs text-destructive'>{fileError}</p>}
            {!fileName && !fileError && (
              <p className='text-xs text-muted-foreground'>必须上传规则图 JSON 文件</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={() => handleOpenChange(false)}>取消</Button>
          <Button onClick={handleConfirm} disabled={!ruleName.trim() || !!fileError}>创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
