import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import type { UserInterface } from '../data/users.type'
import { useUserForm } from '../hooks/useUserForm'
import { UsersMetaFields } from './users-meta-fields'
import { UsersPasswordFields } from './users-password-fields'
import { UsersRoleFields } from './users-role-fields'

export interface UsersFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  currentRow?: UserInterface
}

export function UsersForm({
  open,
  onOpenChange,
  mode,
  currentRow,
}: UsersFormProps) {
  const { t } = useTranslation('users')
  const { form, isCreate, isPending, onSubmit } = useUserForm({
    mode,
    open,
    currentRow,
    onSuccess: () => onOpenChange(false),
  })

  return (
    <EntityFormDialog
      open={open}
      onOpenChange={onOpenChange}
      form={form}
      title={isCreate ? t('form.addTitle') : t('form.updateTitle')}
      description={
        isCreate ? t('form.addDescription') : t('form.updateDescription')
      }
      isCreate={isCreate}
      isPending={isPending}
      contentClassName='sm:max-w-lg'
      labels={{
        saving: t('form.saving'),
        saveAndExit: t('form.saveAndExit'),
        updating: t('form.updating'),
        updateAndExit: t('form.updateAndExit'),
      }}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <UsersMetaFields form={form} />

      <UsersPasswordFields form={form} optional={!isCreate} />

      <UsersRoleFields form={form} />
    </EntityFormDialog>
  )
}
