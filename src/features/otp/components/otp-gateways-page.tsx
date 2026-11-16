import { useTranslation } from 'react-i18next'
import { AdminPageShell } from '@/components/admin/admin-page-shell'
import { useOtpGateways } from '../hooks/use-otp'
import { OtpGatewayCard } from './otp-gateway-card'

/** The SMS providers of AEC "OTP Configurations"; exactly one can be active. */
export function OtpGatewaysPage() {
  const { t } = useTranslation('otp')
  const gateways = useOtpGateways().data?.data

  return (
    <AdminPageShell title={t('gateways.title')} description={t('gateways.description')}>
      {gateways ? (
        <div className='grid gap-6 lg:grid-cols-2'>
          {gateways.map((g) => (
            <OtpGatewayCard key={`${g.key}-${JSON.stringify(g.credentials)}`} gateway={g} />
          ))}
        </div>
      ) : (
        <div aria-busy='true' className='h-40' />
      )}
    </AdminPageShell>
  )
}
