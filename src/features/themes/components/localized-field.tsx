import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getPath } from '../data/set-path'
import { useBlockForm } from '../hooks/use-block-form'
import { FieldShell } from './field-shell'

interface LocalizedFieldProps {
  path: string
  multiline?: boolean
  unsupported?: boolean
}

/** One `{az,en,tr,ru}` text: edits the language chosen in the form's LocaleSwitch. */
export function LocalizedField({ path, multiline = false, unsupported }: LocalizedFieldProps) {
  const { value, set, locale } = useBlockForm()
  const map = (getPath(value, path) ?? {}) as Record<string, string>
  const text = map[locale] ?? ''
  const write = (next: string) => set(path, { ...map, [locale]: next })

  return (
    <FieldShell path={path} unsupported={unsupported}>
      {({ id, disabled }) =>
        multiline ? (
          <Textarea id={id} rows={3} disabled={disabled} value={text} onChange={(e) => write(e.target.value)} />
        ) : (
          <Input id={id} disabled={disabled} value={text} onChange={(e) => write(e.target.value)} />
        )
      }
    </FieldShell>
  )
}
