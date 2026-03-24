import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useEffect, useMemo } from 'react'

const accountFormSchema = z.object({
  language: z.string(),
})

type AccountFormValues = z.infer<typeof accountFormSchema>

export function AccountForm() {
  const { i18n, t } = useTranslation('settings')

  const languages = useMemo(() => [
    { label: 'English', value: 'en_US' },
    { label: '简体中文', value: 'zh_CN' },
  ] as const, [])

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      language: i18n.language || 'zh_CN',
    },
  })

  // 监听语言变化，更新表单
  useEffect(() => {
    form.setValue('language', i18n.language)
  }, [i18n.language, form])

  function onSubmit(data: AccountFormValues) {
    // 切换语言
    i18n.changeLanguage(data.language)
    // 保存到 localStorage
    localStorage.setItem('i18nextLng', data.language)
    // 更新 HTML lang 属性
    document.documentElement.lang = data.language

    toast.success(
      data.language === 'zh_CN'
        ? '语言设置已更新'
        : 'Language settings updated'
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='language'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>{t('language') || 'Language'}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      role='combobox'
                      className={cn(
                        'w-[200px] justify-between',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : t('selectLanguage') || 'Select language'}
                      <CaretSortIcon className='ms-2 h-4 w-4 shrink-0 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-[200px] p-0'>
                  <Command>
                    <CommandInput placeholder={t('searchLanguage') || 'Search language...'} />
                    <CommandEmpty>{t('noLanguageFound') || 'No language found.'}</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue('language', language.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'size-4 me-2',
                                language.value === field.value
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                {t('languageDescription') || 'This is the language that will be used in the dashboard.'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>{t('updateAccount') || 'Update account'}</Button>
      </form>
    </Form>
  )
}
