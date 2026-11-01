import type { NamedEntityInterface } from '@/shared/types'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

type Props = {
  roles: NamedEntityInterface[]
  value: number[]
  onChange: (value: number[]) => void
}

export function RoleCheckboxGroup({ roles, value, onChange }: Props) {
  const { t } = useTranslation('users')
  const toggle = (id: number, checked: boolean) => {
    onChange(checked ? [...value, id] : value.filter((v) => v !== id))
  }

  return (
    <div className='col-span-full space-y-3'>
      <p className='text-sm font-medium'>{t('form.roles')}</p>

      <div className='grid grid-cols-1 gap-3'>
        {roles.map((role) => {
          const checked = value.includes(role.id)

          return (
            <Label
              key={role.id}
              className='flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition hover:bg-accent/50 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950'
            >
              <Checkbox
                checked={checked}
                onCheckedChange={(state) => toggle(role.id, state === true)}
                className='mt-0.5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700'
              />

              <div className='grid gap-1.5 font-normal'>
                <p className='text-sm leading-none font-medium'>{role.name}</p>
                <p className='text-sm text-muted-foreground'>
                  {t('form.roleAccess')}
                </p>
              </div>
            </Label>
          )
        })}
      </div>
    </div>
  )
}
