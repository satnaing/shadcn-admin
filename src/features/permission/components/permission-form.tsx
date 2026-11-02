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
import type { PermissionEntityInterface } from '../data/permission.type'
import { usePermissionForm } from '../hooks/usePermissionForm'
import { usePermissionMutations } from '../hooks/usePermissionMutations'

type PermissionFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'create' | 'edit'
  currentRow?: PermissionEntityInterface
}

export function PermissionForm({
  open,
  onOpenChange,
  mode,
  currentRow,
}: PermissionFormProps) {
  const { t } = useTranslation('permission')
  const isCreate = mode === 'create'

  const form = usePermissionForm(
    isCreate
      ? { name: '', guard_name: '' }
      : {
          name: currentRow?.name ?? '',
          guard_name: currentRow?.guard_name ?? '',
        }
  )

  const { createPermission, updatePermission } = usePermissionMutations()

  useEffect(() => {
    if (currentRow && mode === 'edit') {
      form.reset({
        name: currentRow.name ?? '',
        guard_name: currentRow.guard_name ?? '',
      })
    }
  }, [currentRow, form, mode])

  const onSubmit = async (values: { name: string; guard_name: string }) => {
    await asyncRequest(async () => {
      if (isCreate) {
        await createPermission.mutateAsync(values)
      } else {
        await updatePermission.mutateAsync({
          id: String(currentRow?.id),
          values,
        })
      }
      onOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isCreate ? t('form.addTitle') : t('form.updateTitle')}
          </DialogTitle>
          <DialogDescription>
            {isCreate ? t('form.addDescription') : t('form.updateDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className='max-h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6 bg-transparent'
            >
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
                        placeholder={t('form.namePlaceholder')}
                        {...field}
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
                      {t('form.guardName')}{' '}
                      <span className='text-red-500'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('form.guardNamePlaceholder')}
                        {...field}
                        className='w-full'
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type='submit'
                  className='w-max'
                  disabled={
                    isCreate
                      ? createPermission.isPending
                      : updatePermission.isPending
                  }
                >
                  {isCreate
                    ? createPermission.isPending
                      ? t('form.saving')
                      : t('form.saveAndExit')
                    : updatePermission.isPending
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
