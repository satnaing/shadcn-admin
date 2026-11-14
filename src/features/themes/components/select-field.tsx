import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getPath } from '../data/set-path'
import { useBlockForm } from '../hooks/use-block-form'
import { FieldShell } from './field-shell'

interface SelectFieldProps {
  path: string
  options: { value: string; label: string }[]
  unsupported?: boolean
}

export function SelectField({ path, options, unsupported }: SelectFieldProps) {
  const { value, set } = useBlockForm()
  const current = String(getPath(value, path) ?? '')

  return (
    <FieldShell path={path} unsupported={unsupported}>
      {({ id, disabled }) => (
        <Select value={current} onValueChange={(next) => set(path, next)} disabled={disabled}>
          <SelectTrigger id={id} className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FieldShell>
  )
}
