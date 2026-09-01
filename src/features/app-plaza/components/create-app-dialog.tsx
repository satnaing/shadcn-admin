import { useState } from 'react'
import { Bot, Workflow } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  type AppCreationMethod,
  type AppItem,
  appMethodLabels,
} from '../data/app-types'
import { AvatarPicker } from './avatar-picker'

type CreateAppDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (app: Omit<AppItem, 'id' | 'createdAt'>) => void
}

const methods: { value: AppCreationMethod; desc: string; icon: typeof Bot }[] = [
  {
    value: 'planning',
    desc: '由 AI 根据需求自主规划对话应用，开箱即用',
    icon: Bot,
  },
  {
    value: 'orchestration',
    desc: '通过可视化画布编排工作流节点，构建复杂应用',
    icon: Workflow,
  },
]

export function CreateAppDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateAppDialogProps) {
  const [method, setMethod] = useState<AppCreationMethod>('planning')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [avatar, setAvatar] = useState('')

  const reset = () => {
    setMethod('planning')
    setName('')
    setDescription('')
    setAvatar('')
  }

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate({ name: name.trim(), description: description.trim(), avatar, method })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) reset()
        onOpenChange(open)
      }}
    >
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>创建应用</DialogTitle>
          <DialogDescription>选择创建方式并填写应用的基本信息。</DialogDescription>
        </DialogHeader>

        <div className='space-y-5'>
          {/* 创建方式 */}
          <div className='space-y-2'>
            <Label>创建方式</Label>
            <div className='grid grid-cols-2 gap-3'>
              {methods.map((m) => {
                const Icon = m.icon
                const selected = method === m.value
                return (
                  <button
                    key={m.value}
                    type='button'
                    onClick={() => setMethod(m.value)}
                    className={cn(
                      'flex flex-col items-start gap-2 rounded-lg border p-4 text-start transition-colors',
                      selected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/50'
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-9 items-center justify-center rounded-md',
                        selected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}
                    >
                      <Icon className='size-5' />
                    </span>
                    <span className='text-sm font-medium'>
                      {appMethodLabels[m.value]}
                    </span>
                    <span className='text-xs text-muted-foreground'>{m.desc}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 应用头像 */}
          <div className='space-y-2'>
            <Label>应用头像</Label>
            <AvatarPicker value={avatar} name={name} onChange={setAvatar} />
          </div>

          {/* 应用名称 */}
          <div className='space-y-2'>
            <Label htmlFor='app-name'>应用名称</Label>
            <Input
              id='app-name'
              placeholder='请输入应用名称'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* 应用描述 */}
          <div className='space-y-2'>
            <Label htmlFor='app-desc'>应用描述</Label>
            <Textarea
              id='app-desc'
              placeholder='简要描述应用的用途与能力'
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>
            创建
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
