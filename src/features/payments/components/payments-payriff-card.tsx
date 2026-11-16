import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormCard } from '@/components/forms/form-card'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'
import { PERMISSIONS } from '@/shared/permissions'
import { isPayriffConfigured } from '../data/payments.payriff'
import { type PayriffFormValues, payriffSchema } from '../data/payments.schema'
import { PAYRIFF_MODES, type PayriffSettings } from '../data/payments.type'
import { usePaymentsMutations } from '../hooks/use-payments-mutations'

/**
 * Payriff gateway: activation switch + mode + credentials. The page keys the card by the stored settings,
 * so toggling activation (a refetch) never wipes edits typed into the form.
 */
export function PaymentsPayriffCard({ settings }: { settings: PayriffSettings }) {
  const { t } = useTranslation('payments')
  const { savePayriff, setPayriffActive } = usePaymentsMutations()
  const canManage = usePermissionStore((s) => s.hasPermission)(PERMISSIONS.PAYMENTS.PAYRIFF_MANAGE)
  const { active: _active, ...values } = settings
  const form = useForm<PayriffFormValues>({ resolver: zodResolver(payriffSchema), defaultValues: values })

  return (
    <FormCard
      form={form}
      title={t('payriff.card.title')}
      description={t('payriff.card.description')}
      permission={PERMISSIONS.PAYMENTS.PAYRIFF_MANAGE}
      pending={savePayriff.isPending}
      labels={{ save: t('actions.save'), saving: t('actions.saving') }}
      onSubmit={(v) => savePayriff.mutate(v)}
    >
      <div className='flex items-center justify-between gap-3 rounded-md border p-3'>
        <div className='space-y-1'>
          <Label htmlFor='payriff-active'>{t('payriff.activation')}</Label>
          <Badge variant={settings.mode === 'production' ? 'destructive' : 'secondary'}>{t(`payriff.modes.${settings.mode}`)}</Badge>
          {!isPayriffConfigured(settings) && <p className='text-sm text-muted-foreground'>{t('payriff.saveFirst')}</p>}
        </div>
        <Switch
          id='payriff-active'
          checked={settings.active}
          disabled={!canManage || !isPayriffConfigured(settings) || setPayriffActive.isPending}
          onCheckedChange={(active) => setPayriffActive.mutate(active)}
        />
      </div>
      <FormInputField form={form} name='display_name' label={t('payriff.fields.display_name')} hint={t('payriff.hints.display_name')} />
      <FormSelectField
        form={form}
        name='mode'
        label={t('payriff.fields.mode')}
        options={PAYRIFF_MODES.map((m) => ({ value: m, label: t(`payriff.modes.${m}`) }))}
      />
      <h4 className='pt-2 text-sm font-semibold'>{t('payriff.testCredentials')}</h4>
      <FormInputField form={form} name='test_merchant_id' label={t('payriff.fields.merchant_id')} />
      <FormInputField form={form} name='test_secret_key' type='password' label={t('payriff.fields.secret_key')} />
      <h4 className='pt-2 text-sm font-semibold'>{t('payriff.productionCredentials')}</h4>
      <FormInputField form={form} name='production_merchant_id' label={t('payriff.fields.merchant_id')} />
      <FormInputField form={form} name='production_secret_key' type='password' label={t('payriff.fields.secret_key')} />
    </FormCard>
  )
}
