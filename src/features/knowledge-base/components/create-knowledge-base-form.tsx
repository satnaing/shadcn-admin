import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  FileText,
  Table2,
  ImageIcon,
  Sparkles,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { UploadZone } from './upload-zone'
import {
  type KnowledgeDataType,
  dataTypeOptions,
  uploadFormats,
} from '../data/knowledge-types'

const dataTypeIcons: Record<KnowledgeDataType, typeof FileText> = {
  unstructured: FileText,
  structured: Table2,
  multimodal: ImageIcon,
}

export function CreateKnowledgeBaseForm() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dataType, setDataType] = useState<KnowledgeDataType>('unstructured')
  const [files, setFiles] = useState<File[]>([])

  // 分段处理：自动分段与清洗 / 自定义
  const [segmentMode, setSegmentMode] = useState<'auto' | 'custom'>('auto')
  const [segmentLength, setSegmentLength] = useState('500')
  const [preprocessRules, setPreprocessRules] = useState('')
  // 知识增强
  const [enhancement, setEnhancement] = useState(false)

  // 允许上传的格式随数据类型联动
  const allowedExtensions = useMemo(() => {
    const option = dataTypeOptions.find((o) => o.value === dataType)
    return option ? option.formats : uploadFormats
  }, [dataType])

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error('请输入知识库名称')
      return
    }
    toast.success(`知识库「${name.trim()}」创建成功`)
    setName('')
    setDescription('')
    setFiles([])
    setSegmentMode('auto')
    setEnhancement(false)
  }

  return (
    <div className='mx-auto w-full max-w-3xl space-y-4 pb-10'>
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>基本信息</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='kb-name'>
              知识库名称 <span className='text-destructive'>*</span>
            </Label>
            <Input
              id='kb-name'
              placeholder='请输入知识库名称'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='kb-desc'>知识库描述</Label>
            <Textarea
              id='kb-desc'
              placeholder='请输入知识库描述'
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 数据类型 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>数据类型</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={dataType}
            onValueChange={(v) => setDataType(v as KnowledgeDataType)}
            className='gap-3'
          >
            {dataTypeOptions.map((option) => {
              const Icon = dataTypeIcons[option.value]
              const selected = dataType === option.value
              return (
                <label
                  key={option.value}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors',
                    selected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/50'
                  )}
                >
                  <RadioGroupItem value={option.value} className='mt-0.5' />
                  <div className='flex-1 space-y-1.5'>
                    <div className='flex items-center gap-2'>
                      <Icon
                        className={cn(
                          'size-4',
                          selected ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      <span className='text-sm font-medium'>{option.label}</span>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {option.description}
                    </p>
                    <p className='text-xs text-muted-foreground/80'>
                      支持 {option.formats.join('、')} 格式
                    </p>
                  </div>
                </label>
              )
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* 数据上传 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>数据上传</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadZone
            files={files}
            onAddFiles={(accepted) => setFiles((prev) => [...prev, ...accepted])}
            onRemoveFile={(index) =>
              setFiles((prev) => prev.filter((_, i) => i !== index))
            }
            allowedExtensions={allowedExtensions}
          />
        </CardContent>
      </Card>

      {/* 配置选择 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>配置选择</CardTitle>
        </CardHeader>
        <CardContent className='space-y-5'>
          {/* 分段处理 */}
          <div className='space-y-3'>
            <Label className='flex items-center gap-2 text-sm font-medium'>
              <Layers className='size-4 text-muted-foreground' />
              分段处理
            </Label>
            <RadioGroup
              value={segmentMode}
              onValueChange={(v) => setSegmentMode(v as 'auto' | 'custom')}
              className='gap-2'
            >
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors',
                  segmentMode === 'auto'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                )}
              >
                <RadioGroupItem value='auto' className='mt-0.5' />
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>自动分段与清洗</p>
                  <p className='text-xs text-muted-foreground'>
                    按照默认方式针对上传的文件进行分段处理，无需关注分段规则
                  </p>
                </div>
              </label>
              <label
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors',
                  segmentMode === 'custom'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                )}
              >
                <RadioGroupItem value='custom' className='mt-0.5' />
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>自定义</p>
                  <p className='text-xs text-muted-foreground'>
                    自定义分段规则、分段长度以及预处理规则等参数
                  </p>
                </div>
              </label>
            </RadioGroup>

            {segmentMode === 'custom' && (
              <div className='grid gap-4 rounded-lg border bg-muted/40 p-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='segment-length'>分段长度</Label>
                  <Input
                    id='segment-length'
                    type='number'
                    min={1}
                    value={segmentLength}
                    onChange={(e) => setSegmentLength(e.target.value)}
                  />
                </div>
                <div className='space-y-2 sm:col-span-2'>
                  <Label htmlFor='preprocess-rules'>预处理规则</Label>
                  <Textarea
                    id='preprocess-rules'
                    placeholder='如：去除空行、合并短句、保留表格结构等'
                    rows={2}
                    value={preprocessRules}
                    onChange={(e) => setPreprocessRules(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Embedding 模型设置 */}
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <div className='space-y-1'>
              <Label className='flex items-center gap-2 text-sm font-medium'>
                <Sparkles className='size-4 text-muted-foreground' />
                Embedding 模型设置
              </Label>
              <p className='text-xs text-muted-foreground'>
                用于将文本转换为向量以支持语义检索
              </p>
            </div>
            <Select defaultValue='qwen3-embedding'>
              <SelectTrigger className='w-52'>
                <SelectValue placeholder='选择模型' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='qwen3-embedding'>qwen3-embedding CHAT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* 知识增强 */}
          <div className='flex items-center justify-between gap-3'>
            <div className='space-y-1'>
              <Label className='flex items-center gap-2 text-sm font-medium'>
                <Sparkles className='size-4 text-muted-foreground' />
                知识增强
              </Label>
              <p className='text-xs text-muted-foreground'>
                开启后，系统将利用大模型对上传内容进行理解与补充，提升检索效果
              </p>
            </div>
            <Switch
              checked={enhancement}
              onCheckedChange={setEnhancement}
              aria-label='知识增强'
            />
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end gap-3 pt-2'>
        <Button
          variant='outline'
          onClick={() => {
            setName('')
            setDescription('')
            setFiles([])
            setSegmentMode('auto')
            setEnhancement(false)
          }}
        >
          重置
        </Button>
        <Button onClick={handleCreate}>创建知识库</Button>
      </div>
    </div>
  )
}
