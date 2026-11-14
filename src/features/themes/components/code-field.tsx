import { Textarea } from '@/components/ui/textarea'
import { getPath } from '../data/set-path'
import { useBlockForm } from '../hooks/use-block-form'
import { FieldShell } from './field-shell'

export function CodeField({ path }: { path: string }) {
  const { value, set } = useBlockForm()

  return (
    <FieldShell path={path}>
      {({ id, disabled }) => (
        <Textarea
          id={id}
          rows={8}
          spellCheck={false}
          disabled={disabled}
          className='font-mono text-xs'
          value={String(getPath(value, path) ?? '')}
          onChange={(e) => set(path, e.target.value)}
        />
      )}
    </FieldShell>
  )
}
