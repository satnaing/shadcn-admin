import { useState, useEffect, useRef } from 'react'
import { Check, X, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface EditableTextProps {
  value: string
  onSave: (value: string) => Promise<void>
  placeholder?: string
  className?: string
  variant?: 'singleLine' | 'multiLine'
  disabled?: boolean
  textClassName?: string
}

export function EditableText({
  value,
  onSave,
  placeholder = 'Click to edit',
  className,
  variant = 'singleLine',
  disabled = false,
  textClassName,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if ('select' in inputRef.current) {
        inputRef.current.select()
      }
    }
  }, [isEditing])

  const handleSave = async () => {
    if (editValue.trim() === value.trim()) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(editValue.trim())
      setIsEditing(false)
    } catch (_error) {
      // Reset on error
      setEditValue(value)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && variant === 'singleLine') {
      e.preventDefault()
      handleSave()
    }
  }

  if (isEditing) {
    return (
      <div className='flex items-start gap-2'>
        <div className='flex-1'>
          {variant === 'singleLine' ? (
            <Input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn('h-auto py-1', textClassName)}
              disabled={isSaving}
            />
          ) : (
            <Textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className={cn('min-h-[60px] resize-none', textClassName)}
              disabled={isSaving}
              rows={3}
            />
          )}
        </div>
        <div className='flex gap-1'>
          <Button
            size='icon'
            variant='ghost'
            className='h-8 w-8'
            onClick={handleSave}
            disabled={isSaving || !editValue.trim()}
          >
            <Check className='h-4 w-4' />
          </Button>
          <Button
            size='icon'
            variant='ghost'
            className='h-8 w-8'
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'group flex cursor-pointer items-start gap-2 rounded-md transition-colors',
        !disabled && 'hover:bg-accent/50',
        className
      )}
      onClick={() => !disabled && setIsEditing(true)}
    >
      <div className={cn('flex-1', textClassName)}>
        {value || <span className='text-muted-foreground'>{placeholder}</span>}
      </div>
      {!disabled && (
        <Button
          size='icon'
          variant='ghost'
          className='h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100'
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
        >
          <Pencil className='h-4 w-4' />
        </Button>
      )}
    </div>
  )
}
