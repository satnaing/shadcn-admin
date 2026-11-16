import type { ReactNode } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { PERMISSIONS } from '@/shared/permissions'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { usePermissionStore } from '@/features/auth/data/auth-permission.store'

interface Props<T extends FieldValues> {
  form: UseFormReturn<T>
  title: string
  description: string
  pending: boolean
  onSubmit: (values: T) => void
  children: ReactNode
}

/** One settings card = one form = one save; read-only for users without `affiliate.config_manage`. */
export function AffiliateOptionCard<T extends FieldValues>({
  form,
  title,
  description,
  pending,
  onSubmit,
  children,
}: Props<T>) {
  const { t } = useTranslation('affiliate')
  const canManage = usePermissionStore((s) => s.hasPermission)(
    PERMISSIONS.AFFILIATE.CONFIG_MANAGE
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset disabled={!canManage} className='contents'>
            <CardContent className='space-y-4'>{children}</CardContent>
          </fieldset>
          {canManage && (
            <CardFooter className='justify-end pt-6'>
              <Button type='submit' disabled={pending}>
                {t(pending ? 'actions.saving' : 'actions.save')}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  )
}
