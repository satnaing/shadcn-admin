import { Input } from '@/components/ui/input'
import { getPath } from '../data/set-path'
import { useBlockForm } from '../hooks/use-block-form'
import { FieldShell } from './field-shell'

const HEX = /^#[0-9a-f]{6}$/i

/** Hex colour: native swatch + text box (the shell ColorPicker is the admin-UI theme switcher, not a field). */
export function ColorField({ path, locked = false }: { path: string; locked?: boolean }) {
  const { value, set } = useBlockForm()
  const current = String(getPath(value, path) ?? '')

  return (
    <FieldShell path={path}>
      {({ id, disabled }) => (
        <div className='flex items-center gap-2'>
          <Input
            type='color'
            aria-label={path}
            className='h-9 w-12 p-1'
            disabled={disabled || locked}
            value={HEX.test(current) ? current : '#000000'}
            onChange={(e) => set(path, e.target.value)}
          />
          <Input id={id} disabled={disabled || locked} value={current} onChange={(e) => set(path, e.target.value)} />
        </div>
      )}
    </FieldShell>
  )
}
