import { ImagePicker } from '@/components/image-picker'
import { getPath } from '../data/set-path'
import { useBlockForm } from '../hooks/use-block-form'
import { FieldShell } from './field-shell'

export function ImageField({ path }: { path: string }) {
  const { value, set } = useBlockForm()
  const current = getPath(value, path)

  return (
    <FieldShell path={path}>
      {({ id, disabled }) => (
        <ImagePicker
          id={id}
          disabled={disabled}
          value={typeof current === 'string' ? current : ''}
          onChange={(next) => set(path, next)}
        />
      )}
    </FieldShell>
  )
}
