import { format } from 'date-fns'
import { FileText, Table2, ImageIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  type KnowledgeBaseItem,
  type KnowledgeDataType,
  dataTypeOptions,
} from '../data/knowledge-types'

type KnowledgeBaseGridProps = {
  items: KnowledgeBaseItem[]
  onDelete: (id: string) => void
}

const dataTypeIconMap: Record<KnowledgeDataType, typeof FileText> = {
  unstructured: FileText,
  structured: Table2,
  multimodal: ImageIcon,
}

const dataTypeColorMap: Record<KnowledgeDataType, string> = {
  unstructured: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  structured: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  multimodal: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
}

function getDataTypeLabel(value: KnowledgeDataType) {
  return dataTypeOptions.find((o) => o.value === value)?.label ?? value
}

export function KnowledgeBaseGrid({ items, onDelete }: KnowledgeBaseGridProps) {
  if (items.length === 0) {
    return (
      <p className='py-16 text-center text-sm text-muted-foreground'>
        暂无知识库，点击右上角「创建知识库」开始吧。
      </p>
    )
  }

  return (
    <ul className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {items.map((item) => {
        const Icon = dataTypeIconMap[item.dataType]
        return (
          <li
            key={item.id}
            className='group relative flex flex-col gap-3 rounded-lg border bg-card p-5 shadow-xs transition-colors hover:bg-accent/50'
          >
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-2 size-7 opacity-0 transition-opacity group-hover:opacity-100'
              aria-label={`删除 ${item.name}`}
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className='size-4 text-muted-foreground hover:text-destructive' />
            </Button>
            <div className='flex items-center gap-3'>
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-md',
                  dataTypeColorMap[item.dataType]
                )}
              >
                <Icon className='size-5' />
              </div>
              <div className='min-w-0 flex-1'>
                <h3 className='truncate font-semibold'>{item.name}</h3>
                <p className='mt-0.5 text-xs text-muted-foreground'>
                  {format(item.createdAt, 'yyyy-MM-dd')}
                </p>
              </div>
            </div>
            <p className='line-clamp-2 text-sm text-muted-foreground'>
              {item.description || '暂无描述'}
            </p>
            <div className='flex items-center gap-2 text-xs'>
              <Badge variant='secondary' className='text-xs'>
                {getDataTypeLabel(item.dataType)}
              </Badge>
              <span className='text-muted-foreground'>{item.fileCount} 个文件</span>
              {item.segmentMode === 'custom' && (
                <span className='text-muted-foreground'>自定义分段</span>
              )}
              {item.enhancement && (
                <span className='text-muted-foreground'>知识增强</span>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
