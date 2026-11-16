import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import {
  type NotificationFormValues,
  notificationSchema,
} from '../data/courier.schema'
import type { CourierSettings } from '../data/courier.type'
import { useCourierMutations } from '../hooks/use-courier-mutations'
import { CourierFormCard } from './courier-form-card'

/** Whether a courier is told about a new assignment by e-mail and / or one-time code. */
export function CourierNotificationCard({
  settings,
}: {
  settings: CourierSettings
}) {
  const { t } = useTranslation('courier')
  const { saveSettings } = useCourierMutations()
  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      mail_notification: settings.mail_notification,
      otp_notification: settings.otp_notification,
    },
  })

  return (
    <CourierFormCard
      form={form}
      title={t('config.notificationTitle')}
      description={t('config.notificationDescription')}
      permission={PERMISSIONS.COURIER.CONFIG_MANAGE}
      pending={saveSettings.isPending}
      onSubmit={(v) => saveSettings.mutate(v)}
    >
      <FormSwitchField
        form={form}
        name='mail_notification'
        label={t('config.mail')}
      />
      <FormSwitchField
        form={form}
        name='otp_notification'
        label={t('config.otp')}
        hint={t('config.otpHint')}
      />
    </CourierFormCard>
  )
}
