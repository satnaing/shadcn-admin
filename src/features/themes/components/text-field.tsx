import { Input } from '@/components/ui/input'
import { getPath } from '../data/set-path'
import { useBlockForm } from '../hooks/use-block-form'
import { FieldShell } from './field-shell'

interface TextFieldProps {
  path: string
  type?: 'text' | 'number' | 'email' | 'url' | 'datetime-local'
  unsupported?: boolean
  placeholder?: string
}

export function TextField({ path, type = 'text', unsupported, placeholder }: TextFieldProps) {
  const { value, set } = useBlockForm()
  const current = getPath(value, path)

  return (
    <FieldShell path={path} unsupported={unsupported}>
      {({ id, disabled }) => (
        <Input
          id={id}
          type={type}
          disabled={disabled}
          placeholder={placeholder}
          value={typeof current === 'string' || typeof current === 'number' ? current : ''}
          onChange={(e) => set(path, type === 'number' ? Number(e.target.value) : e.target.value)}
        />
      )}
    </FieldShell>
  )
}
