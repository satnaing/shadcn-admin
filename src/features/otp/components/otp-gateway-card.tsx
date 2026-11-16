import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormCard } from '@/components/forms/form-card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { PERMISSIONS } from '@/shared/permissions'
import { GATEWAY_FIELDS, isConfigured } from '../data/otp.gateways'
import { type GatewayFormValues, gatewaySchema } from '../data/otp.schema'
import type { GatewayItem } from '../data/otp.type'
import { useOtpMutations } from '../hooks/use-otp-mutations'
import { OtpGatewayField } from './otp-gateway-field'

/**
 * One SMS provider: credentials form + activation switch. The page keys the card by the stored
 * credentials, so toggling activation (a refetch) never wipes edits typed into the form.
 */
export function OtpGatewayCard({ gateway }: { gateway: GatewayItem }) {
  const { t } = useTranslation('otp')
  const { saveGateway, setGatewayActive } = useOtpMutations()
  const canManage = usePermissionStore((s) => s.hasPermission)(PERMISSIONS.OTP.GATEWAYS_MANAGE)
  const fields = GATEWAY_FIELDS[gateway.key]
  const form = useForm<GatewayFormValues>({
    resolver: zodResolver(gatewaySchema(gateway.key)),
    defaultValues: Object.fromEntries(fields.map((f) => [f.name, gateway.credentials[f.name] ?? ''])),
  })
  const configured = isConfigured(gateway.key, gateway.credentials)

  return (
    <FormCard
      form={form}
      title={t(`gateways.names.${gateway.key}`)}
      description={t(gateway.active ? 'gateways.activeNow' : 'gateways.inactive')}
      permission={PERMISSIONS.OTP.GATEWAYS_MANAGE}
      pending={saveGateway.isPending}
      labels={{ save: t('actions.save'), saving: t('actions.saving') }}
      onSubmit={(values) => saveGateway.mutate({ key: gateway.key, credentials: values })}
    >
      <div className='flex items-center justify-between gap-3 rounded-md border p-3'>
        <div>
          <Label htmlFor={`otp-gw-${gateway.key}`}>{t('gateways.activation')}</Label>
          {!configured && <p className='text-sm text-muted-foreground'>{t('gateways.saveFirst')}</p>}
        </div>
        <Switch
          id={`otp-gw-${gateway.key}`}
          checked={gateway.active}
          disabled={!canManage || !configured || setGatewayActive.isPending}
          onCheckedChange={(active) => setGatewayActive.mutate({ key: gateway.key, active })}
        />
      </div>
      {fields.map((f) => (
        <OtpGatewayField key={f.name} form={form} field={f} />
      ))}
    </FormCard>
  )
}
