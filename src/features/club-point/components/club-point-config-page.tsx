import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { FormInputField } from '@/components/forms/form-input-field'
import {
  type SettingsFormValues,
  settingsSchema,
} from '../data/club-point.schema'
import { useClubPointSettings } from '../hooks/use-club-point'
import { useClubPointMutations } from '../hooks/use-club-point-mutations'
import { ClubPointFormCard } from './club-point-form-card'

function ConvertRateCard({ defaults }: { defaults: SettingsFormValues }) {
  const { t } = useTranslation('club_point')
  const { saveSettings } = useClubPointMutations()
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaults,
  })

  return (
    <ClubPointFormCard
      form={form}
      title={t('config.cardTitle')}
      description={t('config.cardDescription')}
      permission={PERMISSIONS.CLUB_POINT.CONFIG_MANAGE}
      pending={saveSettings.isPending}
      onSubmit={(v) => saveSettings.mutate(v)}
    >
      <FormInputField
        form={form}
        name='convert_rate'
        type='number'
        label={t('config.convertRate')}
        hint={t('config.convertRateHint')}
      />
    </ClubPointFormCard>
  )
}

/** The single conversion rate: how many points a customer needs for one unit of the store currency. */
export function ClubPointConfigPage() {
  const { t } = useTranslation('club_point')
  const settings = useClubPointSettings().data?.data

  return (
    <AdminPageShell
      title={t('config.title')}
      description={t('config.description')}
    >
      {settings ? (
        <div className='max-w-xl'>
          <ConvertRateCard key={settings.convert_rate} defaults={settings} />
        </div>
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
