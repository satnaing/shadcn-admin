import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import i18n from '@/i18n'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DatePicker } from '@/components/date-picker'

const languages = ['en', 'fr', 'de', 'es', 'pt', 'ru', 'ja', 'ko', 'zh'] as const

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, { error: () => i18n.t('settings:account.errors.nameRequired') })
    .min(2, { error: () => i18n.t('settings:account.errors.nameMin') })
    .max(30, { error: () => i18n.t('settings:account.errors.nameMax') }),
  dob: z.date({ error: () => i18n.t('settings:account.errors.dobRequired') }),
  language: z.string({
    error: () => i18n.t('settings:account.errors.languageRequired'),
  }),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  name: '',
}

export function AccountForm() {
  const { t } = useTranslation('settings')
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  })

  function onSubmit(data: AccountFormValues) {
    showSubmittedData(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('account.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('account.namePlaceholder')} {...field} />
              </FormControl>
              <FormDescription>{t('account.nameDesc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='dob'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('account.dob')}</FormLabel>
              <DatePicker selected={field.value} onSelect={field.onChange} />
              <FormDescription>{t('account.dobDesc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('account.language')}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-50 justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? t(`account.languages.${field.value}`)
                        : t('account.languagePlaceholder')}
                      <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-50 p-0'>
                  <Command>
                    <CommandInput placeholder={t('account.languageSearch')} />
                    <CommandEmpty>{t('account.languageEmpty')}</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={t(`account.languages.${language}`)}
                            key={language}
                            onSelect={() => {
                              form.setValue('language', language)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'size-4',
                                language === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {t(`account.languages.${language}`)}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>{t('account.languageDesc')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t('account.submit')}</Button>
      </form>
    </Form>
  )
}
