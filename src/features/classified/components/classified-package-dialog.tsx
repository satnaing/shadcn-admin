import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import {
  type PackageFormValues,
  packageDefaults,
  packageSchema,
  packageToForm,
} from '../data/classified.schema'
import { LOCALES, type ClassifiedPackage } from '../data/classified.type'
import { useClassifiedMutations } from '../hooks/use-classified-mutations'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Package being edited; `undefined` = create. Remount with `key`. */
  pack?: ClassifiedPackage
  /** Every package, to enforce AEC's rule: only one free (amount 0) package may exist. */
  packages: ClassifiedPackage[]
}

export function ClassifiedPackageDialog({
  open,
  onOpenChange,
  pack,
  packages,
}: Props) {
  const { t } = useTranslation('classified')
  const { createPackage, updatePackage } = useClassifiedMutations()
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: pack ? packageToForm(pack) : packageDefaults,
  })
  const mutation = pack ? updatePackage : createPackage
  const submit = form.handleSubmit((values) => {
    const otherFree = packages.some((p) => p.amount === 0 && p.id !== pack?.id)
    if (values.amount === 0 && otherFree) {
      form.setError('amount', { message: 'classified:validation.oneFree' })
      return
    }
    const onSuccess = () => onOpenChange(false)
    if (pack) updatePackage.mutate({ id: pack.id, values }, { onSuccess })
    else createPackage.mutate(values, { onSuccess })
  })

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t(pack ? 'packages.form.editTitle' : 'packages.form.createTitle')}
      description={t('packages.form.description')}
      isCreate={!pack}
      isPending={mutation.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.save'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.save'),
      }}
      onSubmit={submit}
      contentClassName='sm:max-w-lg'
    >
      {LOCALES.map((l) => (
        <FormInputField
          key={l}
          form={form}
          name={`translations.${l}`}
          label={t('packages.form.name', { lang: l.toUpperCase() })}
        />
      ))}
      <FormInputField
        form={form}
        name='amount'
        type='number'
        label={t('packages.form.amount')}
      />
      <FormInputField
        form={form}
        name='product_upload'
        type='number'
        label={t('packages.form.productUpload')}
        hint={t('packages.form.productUploadHint')}
      />
      <FormImageField form={form} name='logo' label={t('packages.form.logo')} />
    </EntityFormDialog>
  )
}
