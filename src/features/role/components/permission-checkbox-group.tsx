import type { NamedEntityInterface } from '@/shared/types'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type Props = {
  permissions: NamedEntityInterface[]
  value: number[]
  onChange: (value: number[]) => void
}

export function PermissionCheckboxGroup({
  permissions,
  value,
  onChange,
}: Props) {
  const { t } = useTranslation('role')
  const toggle = (id: number, checked: boolean) => {
    onChange(checked ? [...value, id] : value.filter((v) => v !== id))
  }

  return (
    <div className='col-span-full space-y-3'>
      <p className='text-sm font-medium'>{t('form.permissions')}</p>

      <div className='grid gap-3 sm:grid-cols-2'>
        {permissions.map((permission) => {
          const checked = value.includes(permission.id)

          return (
            <Label
              key={permission.id}
              className='flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition hover:bg-accent/50 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950'
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(state) =>
                  toggle(permission.id, state === true)
                }
                className='mt-0.5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
              />

              <div className='grid gap-1.5 font-normal'>
                <p className='text-sm leading-none font-medium'>
                  {permission.name}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {t('form.permission_access')}
                </p>
              </div>
            </Label>
          )
        })}
      </div>
    </div>
  )
}
