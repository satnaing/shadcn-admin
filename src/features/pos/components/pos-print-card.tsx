import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormCard } from '@/components/forms/form-card'
import { FormInputField } from '@/components/forms/form-input-field'
import { PERMISSIONS } from '@/shared/permissions'
import { type PrintWidthValues, printWidthSchema } from '../data/pos.schema'
import type { PosSettings } from '../data/pos.type'
import { usePosMutations } from '../hooks/use-pos-mutations'

/** Thermal printer paper width in mm; receipts cannot be printed until it is set. */
export function PosPrintCard({ settings }: { settings: PosSettings }) {
  const { t } = useTranslation('pos')
  const { saveSettings } = usePosMutations()
  const form = useForm<PrintWidthValues>({
    resolver: zodResolver(printWidthSchema),
    defaultValues: { print_width: settings.print_width ?? ('' as unknown as number) },
  })

  return (
    <FormCard
      form={form}
      title={t('config.printTitle')}
      description={t('config.printDescription')}
      permission={PERMISSIONS.POS.CONFIG_MANAGE}
      pending={saveSettings.isPending}
      labels={{ save: t('actions.save'), saving: t('actions.saving') }}
      onSubmit={(v) => saveSettings.mutate(v)}
    >
      <FormInputField
        form={form}
        name='print_width'
        type='number'
        label={t('config.printWidth')}
        hint={t('config.printHint')}
      />
    </FormCard>
  )
}
