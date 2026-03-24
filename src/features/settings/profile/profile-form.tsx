import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
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
import { Textarea } from '@/components/ui/textarea'
import { useTranslation } from 'react-i18next'
import { authService } from '../api'

const profileFormSchema = z.object({
  username: z
    .string('Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  email: z.email({
    error: (iss) =>
      iss.input === undefined
        ? 'Please select an email to display.'
        : undefined,
  }),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.url('Please enter a valid URL.'),
      })
    )
    .optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  bio: 'I own a computer.',
  urls: [
    { value: 'https://shadcn.com' },
    { value: 'http://twitter.com/shadcn' },
  ],
}

export function ProfileForm() {
  const { t } = useTranslation('settings')
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  const { fields, append } = useFieldArray({
    name: 'urls',
    control: form.control,
  })

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await authService.getUserInfo()
        form.reset({
          username: userInfo.username,
          email: userInfo.email || userInfo.username,
          bio: defaultValues.bio,
          urls: defaultValues.urls,
        })
      } catch (error) {
        toast.error('Failed to load user information')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserInfo()
  }, [form])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className='space-y-8'
      >
        {isLoading ? (
          <div className='space-y-8'>
            <div className='space-y-2'>
              <div className='h-4 w-20 bg-muted animate-pulse rounded' />
              <div className='h-10 bg-muted animate-pulse rounded' />
            </div>
            <div className='space-y-2'>
              <div className='h-4 w-20 bg-muted animate-pulse rounded' />
              <div className='h-10 bg-muted animate-pulse rounded' />
            </div>
          </div>
        ) : (
          <>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('username')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('usernamePlaceholder')} {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    {t('usernameDesc')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('emailPlaceholder')} {...field} disabled />
                  </FormControl>
                  <FormDescription>
                    {t('emailDesc')} <Link to='/'>email settings</Link>.
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
                  <FormLabel>{t('bio')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('bioPlaceholder')}
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('bioDesc')}
                  </FormDescription>
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
                        {t('urls')}
                      </FormLabel>
                      <FormDescription className={cn(index !== 0 && 'sr-only')}>
                        {t('urlsDesc')}
                      </FormDescription>
                      <FormControl className={cn(index !== 0 && 'mt-1.5')}>
                        <Input {...field} />
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
                {t('addUrl')}
              </Button>
            </div>
            <Button type='submit'>{t('updateProfile')}</Button>
          </>
        )}
      </form>
    </Form>
  )
}
