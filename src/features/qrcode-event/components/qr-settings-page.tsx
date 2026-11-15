import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { type SettingsFormValues, settingsSchema } from '../data/qrcode-event.schema'
import { useQrSettings } from '../hooks/use-qrcode-event'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'
import { QrInputField } from './qr-input-field'

function SettingsForm({ defaults }: { defaults: SettingsFormValues }) {
  const { t } = useTranslation('qrcode_event')
  const { saveSettings } = useQrMutations()
  const form = useForm<SettingsFormValues>({ resolver: zodResolver(settingsSchema), defaultValues: defaults })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => saveSettings.mutate(v))} className='space-y-6 rounded-lg border bg-card p-6'>
        <p className='text-sm text-muted-foreground'>{t('settings.hint')}</p>
        <div className='grid gap-4 md:grid-cols-2'>
          <QrInputField form={form} name='android_package' label={t('settings.androidPackage')} />
          <QrInputField form={form} name='android_sha256' label={t('settings.androidSha256')} />
          <QrInputField form={form} name='ios_team_id' label={t('settings.iosTeamId')} />
          <QrInputField form={form} name='ios_bundle_id' label={t('settings.iosBundleId')} />
        </div>
        <div className='flex justify-end border-t pt-6'>
          <Button type='submit' disabled={saveSettings.isPending}>
            {t(saveSettings.isPending ? 'actions.saving' : 'actions.save')}
          </Button>
        </div>
      </form>
    </Form>
  )
}

/** App Links / Universal Links identifiers (served to the scanner app by the API as assetlinks.json / AASA). */
export function QrSettingsPage() {
  const { t } = useTranslation('qrcode_event')
  const { data } = useQrSettings()

  return (
    <AdminPageShell title={t('settings.title')} description={t('settings.description')}>
      {data ? <SettingsForm key='loaded' defaults={data.data} /> : <div aria-busy='true' className='h-40' />}
    </AdminPageShell>
  )
}
