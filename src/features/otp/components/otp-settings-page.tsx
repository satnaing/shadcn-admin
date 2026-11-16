import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { PERMISSIONS } from '@/shared/permissions'
import type { OtpSettings } from '../data/otp.type'
import { useOtpSettings } from '../hooks/use-otp'
import { useOtpMutations } from '../hooks/use-otp-mutations'
import { OtpSettingCard } from './otp-setting-card'

const SETTINGS: (keyof OtpSettings)[] = ['login_with_otp', 'guest_checkout_with_otp', 'cod_wallet_otp']

/** The three OTP switches of AEC "OTP System Settings". */
export function OtpSettingsPage() {
  const { t } = useTranslation('otp')
  const settings = useOtpSettings().data?.data
  const { saveSettings } = useOtpMutations()
  const canManage = usePermissionStore((s) => s.hasPermission)(PERMISSIONS.OTP.SETTINGS_MANAGE)

  return (
    <AdminPageShell title={t('settings.title')} description={t('settings.description')}>
      {settings ? (
        <div className='grid max-w-3xl gap-4'>
          {SETTINGS.map((name) => (
            <OtpSettingCard
              key={name}
              title={t(`settings.items.${name}.title`)}
              description={t(`settings.items.${name}.description`)}
              checked={settings[name]}
              disabled={!canManage || saveSettings.isPending}
              onChange={(value) => saveSettings.mutate({ [name]: value })}
            />
          ))}
        </div>
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
