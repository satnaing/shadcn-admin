import { useRef, useState, type DragEvent } from 'react'
import { CloudUpload, File as FileIcon, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MAX_FILE_COUNT } from '../data/knowledge-types'
import { filterFiles, formatBytes } from '../lib/knowledge-service'

type UploadZoneProps = {
  files: File[]
  onAddFiles: (files: File[]) => void
  onRemoveFile: (index: number) => void
  allowedExtensions: string[]
}

export function UploadZone({
  files,
  onAddFiles,
  onRemoveFile,
  allowedExtensions,
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (incoming: File[]) => {
    const { accepted, errors } = filterFiles(incoming, files.length, allowedExtensions)
    if (accepted.length > 0) onAddFiles(accepted)
    if (errors.length > 0) {
      errors.forEach((msg) => toast.error(msg))
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(Array.from(e.dataTransfer.files))
  }

  return (
    <div className='space-y-3'>
      <div
        role='button'
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click()
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          dragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        )}
      >
        <input
          ref={inputRef}
          type='file'
          multiple
          className='hidden'
          onChange={(e) => {
            handleFiles(Array.from(e.target.files ?? []))
            e.target.value = ''
          }}
        />
        <CloudUpload className='size-8 text-muted-foreground' />
        <div className='space-y-1'>
          <p className='text-sm font-medium'>拖拽文件至此，或者选择文件</p>
          <p className='text-xs text-muted-foreground'>
            支持 {allowedExtensions.join('、')} 格式
          </p>
        </div>
        <Button type='button' size='sm' variant='outline'>
          选择文件
        </Button>
      </div>

      {files.length > 0 && (
        <ul className='space-y-2'>
          {files.map((file, i) => (
            <li
              key={`${file.name}-${i}`}
              className='flex items-center gap-3 rounded-lg border bg-card p-3'
            >
              <FileIcon className='size-4 shrink-0 text-muted-foreground' />
              <span className='min-w-0 flex-1 truncate text-sm' title={file.name}>
                {file.name}
              </span>
              <span className='shrink-0 text-xs text-muted-foreground'>
                {formatBytes(file.size)}
              </span>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-7'
                aria-label={`移除 ${file.name}`}
                onClick={() => onRemoveFile(i)}
              >
                <X className='size-4' />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <p className='text-xs text-muted-foreground'>
        每个文件不超过 15MB，最多同时上传 {MAX_FILE_COUNT} 个文件（已选{' '}
        {files.length} 个）
      </p>
    </div>
  )
}
