import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'
import { keyOf } from '../data/set-path'
import { useBlockForm } from '../hooks/use-block-form'
import { useThemeT } from '../hooks/useThemeT'

interface FieldShellProps {
  path: string
  unsupported?: boolean
  children: (props: { id: string; disabled: boolean }) => ReactNode
}

/** Label (`f.<path>`), optional hint (`h.<path>`) and the "no front support" note. */
export function FieldShell({ path, unsupported = false, children }: FieldShellProps) {
  const t = useThemeT()
  const { disabled } = useBlockForm()
  const key = keyOf(path)
  const hint = t(`h.${key}`, { defaultValue: '' })

  return (
    <div className='space-y-1.5'>
      <Label htmlFor={path}>{t([`f.${key}`, `leaf.${key.split('.').pop()}`], { defaultValue: key.split('.').pop() })}</Label>
      {children({ id: path, disabled: disabled || unsupported })}
      {unsupported && <p className='text-xs text-amber-600'>{t('common.noFrontSupport')}</p>}
      {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
    </div>
  )
}
