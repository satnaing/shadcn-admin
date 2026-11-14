import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Textarea } from '@/components/ui/textarea'
import { useBuilderStore } from '../../data/builder.store'

interface RawJsonEditorProps {
  sectionId: string
  payload: Record<string, unknown>
}

/** Fallback for sections without `payload_schema` (Q-B2). Invalid JSON is never saved. */
export function RawJsonEditor({ sectionId, payload }: RawJsonEditorProps) {
  const { t } = useTranslation('pages')
  const setPayload = useBuilderStore((s) => s.setPayload)
  const [text, setText] = useState(() => JSON.stringify(payload, null, 2))
  const [error, setError] = useState(false)

  const change = (next: string) => {
    setText(next)
    try {
      const parsed: unknown = JSON.parse(next)
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('not an object')
      setError(false)
      setPayload(sectionId, parsed as Record<string, unknown>)
    } catch {
      setError(true)
    }
  }

  return (
    <div className='space-y-2'>
      <p className='text-xs text-muted-foreground'>{t('field.noSchema')}</p>
      <Textarea
        aria-label={t('field.rawJson')}
        aria-invalid={error}
        rows={16}
        className='font-mono text-xs'
        value={text}
        onChange={(e) => change(e.target.value)}
      />
      {error ? <p className='text-xs text-destructive'>{t('field.invalidJson')}</p> : null}
    </div>
  )
}
