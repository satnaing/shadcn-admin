import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const profileFormSchema = z.object({
  username: z
    .string(i18next.t('settings:profile.usernameRequired'))
    .min(2, i18next.t('settings:profile.usernameMin'))
    .max(30, i18next.t('settings:profile.usernameMax')),
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? i18next.t('settings:profile.emailRequired')
        : undefined,
  }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.url(i18next.t('settings:profile.invalidUrl')),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  bio: 'I own a computer.',
  urls: [
    { value: 'https://shadcn.com' },
    { value: 'http://twitter.com/shadcn' },
  ],
}

export function ProfileForm() {
  const { t } = useTranslation('settings')
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.username')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('profile.usernamePlaceholder')}
                  {...field}
                  className='w-full'
                />
              </FormControl>
              <FormDescription>{t('profile.usernameDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.email')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder={t('profile.emailPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='m@example.com'>m@example.com</SelectItem>
                  <SelectItem value='m@google.com'>m@google.com</SelectItem>
                  <SelectItem value='m@support.com'>m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t('profile.emailDescription')}{' '}
                <Link to='/'>email settings</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('profile.bio')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('profile.bioPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormDescription>{t('profile.bioDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {fields.map((field, index) => (
            <FormField
              control={form.control}
              key={field.id}
              name={`urls.${index}.value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={cn(index !== 0 && 'sr-only')}>
                    {t('profile.urls')}
                  </FormLabel>
                  <FormDescription className={cn(index !== 0 && 'sr-only')}>
                    {t('profile.urlsDescription')}
                  </FormDescription>
                  <FormControl className={cn(index !== 0 && 'mt-1.5')}>
                    <Input {...field} className='w-full' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='mt-2'
            onClick={() => append({ value: '' })}
          >
            {t('profile.addUrl')}
          </Button>
        </div>
        <Button type='submit'>{t('profile.update')}</Button>
      </form>
    </Form>
  )
}
