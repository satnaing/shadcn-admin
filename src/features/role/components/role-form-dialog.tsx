import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type RoleFormValues, roleSchema } from '../data/role.schema'
import type { Role } from '../data/role.type'
import { useRoleMutations } from '../hooks/useRoles'
import { PermissionPicker } from './permission-picker'

interface RoleFormDialogProps {
  /** `null` = closed, `'new'` = create, a role = edit */
  target: Role | 'new' | null
  onClose: () => void
}

const EMPTY: RoleFormValues = { name: '', description: '', permissions: [] }

export function RoleFormDialog({ target, onClose }: RoleFormDialogProps) {
  const { t } = useTranslation('roles')
  const { createRole, updateRole } = useRoleMutations()
  const role = target && target !== 'new' ? target : null
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (target) {
      form.reset(role ? { name: role.name, description: role.description, permissions: role.permissions } : EMPTY)
    }
  }, [target, role, form])

  const done = () => {
    toast.success(t('form.saved'))
    onClose()
  }
  const submit = form.handleSubmit((values) =>
    role
      ? updateRole.mutate({ id: String(role.id), values }, { onSuccess: done })
      : createRole.mutate(values, { onSuccess: done })
  )
  const pending = createRole.isPending || updateRole.isPending

  return (
    <Dialog open={target !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-3xl'>
        <DialogHeader>
          <DialogTitle>{role ? t('form.editTitle') : t('form.createTitle')}</DialogTitle>
          <DialogDescription>{t('form.description')}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='role-name'>{t('form.name')}</Label>
              <Input id='role-name' {...form.register('name')} />
              {form.formState.errors.name && (
                <p className='text-sm text-destructive'>{t('form.nameInvalid')}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='role-description'>{t('form.descriptionLabel')}</Label>
              <Input id='role-description' {...form.register('description')} />
            </div>
          </div>

          <Alert>
            <Info className='size-4' />
            <AlertDescription>{t('form.ownershipNote')}</AlertDescription>
          </Alert>

          <Controller
            control={form.control}
            name='permissions'
            render={({ field }) => (
              <PermissionPicker value={field.value} onChange={field.onChange} />
            )}
          />

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              {t('form.cancel')}
            </Button>
            <Button type='submit' disabled={pending}>
              {t('form.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
