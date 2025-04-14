import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PinInput, PinInputField } from '@/components/pin-input'

type OtpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  otp: z.string().min(1, { message: 'Please enter your otp code.' }),
})

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [disabledBtn, setDisabledBtn] = useState(true)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    showSubmittedData(data)

    setTimeout(() => {
      setIsLoading(false)
      navigate({ to: '/' })
    }, 1000)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem className='space-y-1'>
              <FormControl>
                <PinInput
                  {...field}
                  className='flex h-10 justify-between'
                  onComplete={() => setDisabledBtn(false)}
                  onIncomplete={() => setDisabledBtn(true)}
                >
                  {Array.from({ length: 7 }, (_, i) => {
                    if (i === 3)
                      return <Separator key={i} orientation='vertical' />
                    return (
                      <PinInputField
                        key={i}
                        component={Input}
                        className={`${form.getFieldState('otp').invalid ? 'border-red-500' : ''}`}
                      />
                    )
                  })}
                </PinInput>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={disabledBtn || isLoading}>
          Verify
        </Button>
      </form>
    </Form>
  )
}
