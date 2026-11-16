import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import { type ReplyFormValues, replySchema } from '../data/preorder.schema'

interface Props {
  label: string
  isPending: boolean
  initial?: string
  onSend: (text: string) => void
}

/** Single textarea + send button shared by conversation replies and product-query answers. */
export function PreorderReplyBox({
  label,
  isPending,
  initial = '',
  onSend,
}: Props) {
  const { t } = useTranslation('preorder')
  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { text: initial },
  })
  const submit = form.handleSubmit(({ text }) => {
    onSend(text)
    form.reset({ text: '' })
  })

  return (
    <Form {...form}>
      <form onSubmit={submit} className='space-y-2'>
        <FormTextareaField form={form} name='text' label={label} rows={3} />
        <div className='flex justify-end'>
          <Button type='submit' size='sm' disabled={isPending}>
            {t(isPending ? 'actions.saving' : 'actions.send')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
