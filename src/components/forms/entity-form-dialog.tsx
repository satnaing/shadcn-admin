import type { FormEventHandler, ReactNode } from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'

interface EntityFormDialogProps<TFieldValues extends FieldValues> {
  open: boolean
  onOpenChange: (open: boolean) => void
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
  contentClassName?: string
}

export function EntityFormDialog<TFieldValues extends FieldValues>({
  open,
  onOpenChange,
  form,
  title,
  description,
  isCreate,
  isPending,
  labels,
  onSubmit,
  children,
  contentClassName = 'sm:max-w-2xl',
}: EntityFormDialogProps<TFieldValues>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={contentClassName}>
        <DialogHeader className='text-start'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='max-h-[70vh] w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form onSubmit={onSubmit} className='space-y-6 bg-transparent'>
              {children}
              <DialogFooter>
                <Button type='submit' className='w-max' disabled={isPending}>
                  {isCreate
                    ? isPending
                      ? labels.saving
                      : labels.saveAndExit
                    : isPending
                      ? labels.updating
                      : labels.updateAndExit}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
