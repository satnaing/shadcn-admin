import { useMemo } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Resolver, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { buildGroupSchema } from '../data/settings.schema'
import { SETTINGS_FIELDS } from '../data/settings-fields'
import type { GroupValues, SettingsGroup } from '../data/settings.type'
import { useSaveSettingsGroup, useSettingsGroup } from '../hooks/useSettingsGroup'
import { SettingsField } from './settings-field'

/** One key/value settings group driven by `SETTINGS_FIELDS[group]`. */
export function SettingsGroupForm({ group }: { group: SettingsGroup }) {
  const { t } = useTranslation('settings')
  const { data, isLoading, isError } = useSettingsGroup(group)

  if (isLoading) return <Skeleton className='h-72 w-full' />
  if (isError || !data) {
    return (
      <Alert variant='destructive'>
        <AlertDescription>{t('common.loadError')}</AlertDescription>
      </Alert>
    )
  }

  return <GroupFormBody group={group} initial={data.data} />
}

// Mounted only once the values exist, so Controllers (selects, switches) start with them.
function GroupFormBody({ group, initial }: { group: SettingsGroup; initial: GroupValues }) {
  const { t } = useTranslation('settings')
  const fields = SETTINGS_FIELDS[group]
  const save = useSaveSettingsGroup(group)
  const schema = useMemo(() => buildGroupSchema(fields), [fields])
  const form = useForm<GroupValues>({
    resolver: zodResolver(schema) as unknown as Resolver<GroupValues>,
    defaultValues: initial,
  })

  return (
    <form
      onSubmit={form.handleSubmit((values) => save.mutate(values))}
      className='space-y-4'
      noValidate
    >
      <div className='grid gap-4 md:grid-cols-2'>
        {fields.map((def) => (
          <SettingsField
            key={def.name}
            group={group}
            def={def}
            control={form.control}
            register={form.register}
            errors={form.formState.errors}
          />
        ))}
      </div>
      <Button type='submit' disabled={save.isPending}>
        {t('common.save')}
      </Button>
    </form>
  )
}
