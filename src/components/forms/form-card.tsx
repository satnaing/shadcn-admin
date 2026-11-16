import type { ReactNode } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
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
  /** Write permission; the card is read-only without it. */
  permission: string
  pending: boolean
  labels: { save: string; saving: string }
  onSubmit: (values: T) => void
  children: ReactNode
}

/** One settings card = one form = one save (shared version of the per-module `*FormCard` copies). */
export function FormCard<T extends FieldValues>({
  form,
  title,
  description,
  permission,
  pending,
  labels,
  onSubmit,
  children,
}: Props<T>) {
  const canManage = usePermissionStore((s) => s.hasPermission)(permission)

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
                {pending ? labels.saving : labels.save}
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  )
}
