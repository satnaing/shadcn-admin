import { Switch } from '@/components/ui/switch'
import { getPath } from '../data/set-path'
import { useBlockForm } from '../hooks/use-block-form'
import { FieldShell } from './field-shell'

export function SwitchField({ path, unsupported }: { path: string; unsupported?: boolean }) {
  const { value, set } = useBlockForm()

  return (
    <FieldShell path={path} unsupported={unsupported}>
      {({ id, disabled }) => (
        <Switch
          id={id}
          disabled={disabled}
          checked={Boolean(getPath(value, path))}
          onCheckedChange={(next) => set(path, next)}
        />
      )}
    </FieldShell>
  )
}
