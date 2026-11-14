import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getPath, keyOf, moveItem } from '../data/set-path'
import { useBlockForm } from '../hooks/use-block-form'
import { useThemeT } from '../hooks/useThemeT'

interface ListEditorProps {
  path: string
  makeItem: () => unknown
  children: (prefix: string, index: number) => ReactNode
}

/** Add / remove / reorder rows of an array field; rows render their own fields under `prefix`. */
export function ListEditor({ path, makeItem, children }: ListEditorProps) {
  const t = useThemeT()
  const { value, set, disabled } = useBlockForm()
  const items = (getPath(value, path) as unknown[] | undefined) ?? []

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold'>{t([`f.${keyOf(path)}`, `leaf.${keyOf(path).split('.').pop()}`])}</h3>
        <Button type='button' size='sm' variant='outline' disabled={disabled} onClick={() => set(path, [...items, makeItem()])}>
          <Plus className='size-4' /> {t('common.add')}
        </Button>
      </div>
      {items.length === 0 && <p className='text-sm text-muted-foreground'>{t('common.empty')}</p>}
      {items.map((_, index) => (
        <Card key={`${path}.${index}`}>
          <CardContent className='space-y-3 pt-4'>
            <div className='flex justify-end gap-1'>
              <Button type='button' size='icon' variant='ghost' aria-label={t('common.up')} disabled={disabled || index === 0} onClick={() => set(path, moveItem(items, index, index - 1))}>
                <ArrowUp className='size-4' />
              </Button>
              <Button type='button' size='icon' variant='ghost' aria-label={t('common.down')} disabled={disabled || index === items.length - 1} onClick={() => set(path, moveItem(items, index, index + 1))}>
                <ArrowDown className='size-4' />
              </Button>
              <Button type='button' size='icon' variant='ghost' aria-label={t('common.remove')} disabled={disabled} onClick={() => set(path, items.filter((_item, i) => i !== index))}>
                <Trash2 className='size-4' />
              </Button>
            </div>
            <div className='grid gap-3 sm:grid-cols-2'>{children(`${path}.${index}`, index)}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
