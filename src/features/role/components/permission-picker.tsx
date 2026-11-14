import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { humanize, PERMISSION_GROUPS } from '@/shared/permission-tree'

interface PermissionPickerProps {
  value: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
}

export function PermissionPicker({ value, onChange, disabled }: PermissionPickerProps) {
  const { t } = useTranslation('roles')
  const [search, setSearch] = useState('')
  const selected = useMemo(() => new Set(value), [value])

  const groups = useMemo(() => {
    const q = search.trim().toLowerCase()
    return PERMISSION_GROUPS.map((group) => ({
      ...group,
      keys: q ? group.keys.filter((k) => k.name.includes(q)) : group.keys,
    })).filter((group) => group.keys.length > 0)
  }, [search])

  const toggle = (names: string[], on: boolean) => {
    const next = new Set(selected)
    names.forEach((name) => (on ? next.add(name) : next.delete(name)))
    onChange([...next])
  }

  return (
    <div className='space-y-3'>
      <div className='relative'>
        <Search className='absolute top-2.5 left-2.5 size-4 text-muted-foreground' />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('picker.search')}
          className='pl-8'
        />
      </div>

      {groups.length === 0 && (
        <p className='py-6 text-center text-sm text-muted-foreground'>{t('picker.empty')}</p>
      )}

      <div className='max-h-96 space-y-4 overflow-y-auto pr-1'>
        {groups.map((group) => {
          const names = group.keys.map((k) => k.name)
          const count = names.filter((n) => selected.has(n)).length

          return (
            <fieldset key={group.id} className='space-y-2 rounded-md border p-3'>
              <legend className='px-1'>
                <label className='flex items-center gap-2 text-sm font-medium'>
                  <Checkbox
                    checked={count === names.length}
                    disabled={disabled}
                    onCheckedChange={(on) => toggle(names, on === true)}
                    aria-label={t('picker.selectAll')}
                  />
                  {t(`groups.${group.id}`, { defaultValue: humanize(group.id) })}
                  <span className='text-xs text-muted-foreground'>
                    {count}/{names.length}
                  </span>
                </label>
              </legend>
              <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
                {group.keys.map(({ name, action }) => (
                  <label key={name} className='flex items-center gap-2 text-sm'>
                    <Checkbox
                      checked={selected.has(name)}
                      disabled={disabled}
                      onCheckedChange={(on) => toggle([name], on === true)}
                    />
                    <span title={name}>
                      {t(`actions.${action}`, { defaultValue: humanize(action) })}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )
        })}
      </div>
    </div>
  )
}
