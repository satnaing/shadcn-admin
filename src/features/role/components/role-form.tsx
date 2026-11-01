import { useEffect } from 'react'
import { asyncRequest } from '@/shared/helper'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAllPermissions } from '@/features/permission/hooks/useAllPermissions'
import type { RoleFormValues } from '../data/role.schema'
import type { RoleEntityInterface } from '../data/role.type'
import { useRole } from '../hooks/useRole'
import { useRoleForm } from '../hooks/useRoleForm'
import { useRoleMutations } from '../hooks/useRoleMutations'
import { PermissionCheckboxGroup } from './permission-checkbox-group'

type RoleFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  currentRow?: RoleEntityInterface
}

export function RoleForm({
  open,
  onOpenChange,
  mode,
  currentRow,
}: RoleFormProps) {
  const { t } = useTranslation('role')
  const isCreate = mode === 'create'

  const { data: roleDetail } = useRole(currentRow ? String(currentRow.id) : '')

  const form = useRoleForm(
    isCreate
      ? { name: '', guard_name: 'web', permission_ids: [] }
      : {
          name: currentRow?.name ?? '',
          guard_name: currentRow?.guard_name ?? '',
          permission_ids: [],
        }
  )

  const { data: permissions = [] } = useAllPermissions()
  const { createRole, updateRole } = useRoleMutations()

  useEffect(() => {
    if (roleDetail?.data && !isCreate) {
      form.reset({
        name: roleDetail.data.name ?? '',
        guard_name: roleDetail.data.guard_name ?? '',
        permission_ids: roleDetail.data.permissions?.map((p) => p.id) ?? [],
      })
    }
  }, [roleDetail, isCreate])

  const onSubmit = async (values: RoleFormValues) => {
    await asyncRequest(async () => {
      if (isCreate) {
        await createRole.mutateAsync(values)
      } else {
        await updateRole.mutateAsync({
          id: String(currentRow?.id),
          values,
        })
      }
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isCreate ? t('form.addTitle') : t('form.updateTitle')}
          </DialogTitle>
          <DialogDescription>
            {isCreate ? t('form.addDescription') : t('form.updateDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6 bg-transparent'
            >
              <div className='grid gap-6 md:grid-cols-2'>
                <FormField
                  name='name'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('form.name')} <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('form.namePlaceholder')}
                          className='w-full'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name='guard_name'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('form.guard')}{' '}
                        <span className='text-red-500'>*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t('form.guardPlaceholder')}
                          className='w-full'
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <PermissionCheckboxGroup
                permissions={permissions}
                value={form.watch('permission_ids')}
                onChange={(val) => form.setValue('permission_ids', val)}
              />

              <DialogFooter>
                <Button
                  type='submit'
                  className='w-max'
                  disabled={
                    isCreate ? createRole.isPending : updateRole.isPending
                  }
                >
                  {isCreate
                    ? createRole.isPending
                      ? t('form.saving')
                      : t('form.saveAndExit')
                    : updateRole.isPending
                      ? t('form.updating')
                      : t('form.updateAndExit')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
