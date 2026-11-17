import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { addMany, removeTag, type TagLimits } from './tag-input.logic'

export interface TagInputProps extends TagLimits {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
}

/** Chips input: Enter / comma adds, Backspace on an empty box removes the last, × removes one. */
export function TagInput({ value, onChange, placeholder, disabled, id, className, maxLength, maxTags }: TagInputProps) {
  const { t } = useTranslation('common')
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string>()

  const commit = (text: string) => {
    const { tags, rejected } = addMany(value, text, { maxLength, maxTags })
    if (tags !== value) onChange(tags)
    setError(rejected && rejected !== 'empty' ? t(`tagInput.${rejected}`, { max: rejected === 'tooMany' ? maxTags : maxLength }) : undefined)
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit(draft)
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(removeTag(value, value.length - 1))
    }
  }

  return (
    <div className={cn('space-y-1', className)}>
      <div className='flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border bg-transparent px-2 py-1.5 focus-within:ring-[3px] focus-within:ring-ring/50'>
        {value.map((tag, i) => (
          <Badge key={tag} variant='secondary' className='gap-1'>
            {tag}
            {!disabled && (
              <button type='button' aria-label={t('tagInput.remove', { tag })} onClick={() => onChange(removeTag(value, i))}>
                <X />
              </button>
            )}
          </Badge>
        ))}
        <input
          id={id}
          value={draft}
          disabled={disabled}
          placeholder={value.length ? undefined : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft && commit(draft)}
          className='min-w-24 flex-1 bg-transparent text-sm outline-none'
        />
      </div>
      {error && <p className='text-xs text-destructive'>{error}</p>}
    </div>
  )
}
