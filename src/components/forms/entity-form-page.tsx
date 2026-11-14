import type { FormEventHandler, ReactNode } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AdminPageShell } from '@/components/admin/admin-page-shell'

interface EntityFormPageProps<TFieldValues extends FieldValues> {
  backTo: string
  form: UseFormReturn<TFieldValues>
  title: string
  description: string
  isCreate: boolean
  isPending: boolean
  labels: {
    saving: string
    saveAndExit: string
    updating: string
    updateAndExit: string
  }
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

export function EntityFormPage<TFieldValues extends FieldValues>({
  backTo,
  form,
  title,
  description,
  isCreate,
  isPending,
  labels,
  onSubmit,
  children,
}: EntityFormPageProps<TFieldValues>) {
  const { t } = useTranslation('common')

  return (
    <AdminPageShell
      title={title}
      description={description}
      actions={
        <Button asChild variant='outline'>
          <Link to={backTo}>
            <ArrowLeft className='me-2 size-4' />
            {t('form.backToList')}
          </Link>
        </Button>
      }
    >
      <div className='rounded-lg border bg-card p-6'>
        <Form {...form}>
          <form onSubmit={onSubmit} className='space-y-6'>
            {children}
            <div className='flex justify-end border-t pt-6'>
              <Button type='submit' disabled={isPending}>
                {isCreate
                  ? isPending
                    ? labels.saving
                    : labels.saveAndExit
                  : isPending
                    ? labels.updating
                    : labels.updateAndExit}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminPageShell>
  )
}
