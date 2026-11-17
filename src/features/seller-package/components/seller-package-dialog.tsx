import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormImageField } from '@/components/forms/form-image-field'
import { FormInputField } from '@/components/forms/form-input-field'
import { useModuleEnabled } from '@/hooks/use-module-enabled'
import {
  type PackageFormValues,
  packageDefaults,
  packageSchema,
  packageToForm,
} from '../data/seller-package.schema'
import { LOCALES, type SellerPackage } from '../data/seller-package.type'
import { useSellerPackageMutations } from '../hooks/use-seller-package-mutations'
import { SellerPackageLimitsFields } from './seller-package-limits-fields'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Package being edited; `undefined` = create. Remount with `key`. */
  pack?: SellerPackage
}

export function SellerPackageDialog({ open, onOpenChange, pack }: Props) {
  const { t } = useTranslation('seller_package')
  const preorder = useModuleEnabled('preorder')
  const { create, update } = useSellerPackageMutations()
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: pack ? packageToForm(pack) : packageDefaults,
  })
  const mutation = pack ? update : create
  const submit = form.handleSubmit((values) => {
    const onSuccess = () => onOpenChange(false)
    if (pack) update.mutate({ id: pack.id, values }, { onSuccess })
    else create.mutate(values, { onSuccess })
  })

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={t(pack ? 'form.editTitle' : 'form.createTitle')}
      description={t('form.description')}
      isCreate={!pack}
      isPending={mutation.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.save'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.save'),
      }}
      onSubmit={submit}
      contentClassName='sm:max-w-2xl'
    >
      {LOCALES.map((l) => (
        <FormInputField
          key={l}
          form={form}
          name={`translations.${l}`}
          label={t('form.name', { lang: l.toUpperCase() })}
        />
      ))}
      <div className='grid gap-4 sm:grid-cols-2'>
        <FormInputField
          form={form}
          name='amount'
          type='number'
          label={t('form.amount')}
        />
        <FormInputField
          form={form}
          name='duration'
          type='number'
          label={t('form.duration')}
          hint={t('form.durationHint')}
        />
        <FormInputField
          form={form}
          name='product_upload_limit'
          type='number'
          label={t('form.productUploadLimit')}
        />
        {preorder && (
          <FormInputField
            form={form}
            name='preorder_product_upload_limit'
            type='number'
            label={t('form.preorderUploadLimit')}
          />
        )}
      </div>
      <FormImageField form={form} name='logo' label={t('form.logo')} />
      <SellerPackageLimitsFields form={form} />
    </EntityFormDialog>
  )
}
