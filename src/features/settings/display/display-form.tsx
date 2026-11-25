import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export function DisplayForm() {
  const { t } = useTranslation()

  const displayFormSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: t('validation.select_one_item'),
    }),
  })

  type DisplayFormValues = z.infer<typeof displayFormSchema>

  // This can come from your database or API.
  const defaultValues: Partial<DisplayFormValues> = {
    items: ['recents', 'home'],
  }

  const form = useForm<DisplayFormValues>({
    resolver: zodResolver(displayFormSchema),
    defaultValues,
  })

  const items = [
    {
      id: 'recents',
      label: t('settings_form.recents'),
    },
    {
      id: 'home',
      label: t('settings_form.home'),
    },
    {
      id: 'applications',
      label: t('settings_form.applications'),
    },
    {
      id: 'desktop',
      label: t('settings_form.desktop'),
    },
    {
      id: 'downloads',
      label: t('settings_form.downloads'),
    },
    {
      id: 'documents',
      label: t('settings_form.documents'),
    },
  ] as const

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='items'
          render={() => (
            <FormItem>
              <div className='mb-4'>
                <FormLabel className='text-base'>
                  {t('settings_form.sidebar_label')}
                </FormLabel>
                <FormDescription>
                  {t('settings_form.sidebar_desc')}
                </FormDescription>
              </div>
              {items.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name='items'
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className='flex flex-row items-start'
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className='font-normal'>
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t('settings_form.update_display')}</Button>
      </form>
    </Form>
  )
}
