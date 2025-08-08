import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { CalendarIcon, CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { Form, useActionData, useNavigation } from 'react-router'
import type { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'
import { accountFormSchema, type action } from './route'

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const

type AccountFormValues = z.infer<typeof accountFormSchema>

// This can come from your database or API.
const defaultValue: Partial<AccountFormValues> = {
  name: '',
}

export function AccountForm() {
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm<AccountFormValues>({
    lastResult: actionData?.lastResult,
    defaultValue,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: accountFormSchema }),
  })
  const navigation = useNavigation()

  return (
    <Form method="POST" {...getFormProps(form)} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor={fields.name.id}>Name</Label>
        <Input
          {...getInputProps(fields.name, { type: 'text' })}
          placeholder="Your name"
        />
        <div className="text-muted-foreground text-[0.8rem]">
          This is the name that will be displayed on your profile and in emails.
        </div>
        <div
          id={fields.name.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.name.errors}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor={fields.dob.id}>Date of birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={fields.dob.id}
              variant="outline"
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !fields.dob.value && 'text-muted-foreground',
              )}
            >
              {fields.dob.value ? (
                format(fields.dob.value, 'MMM d, yyyy')
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                fields.dob.value ? new Date(fields.dob.value) : undefined
              }
              onSelect={(date) => {
                form.update({
                  name: fields.dob.name,
                  value: date ? format(date, 'yyyy-MM-dd') : '',
                })
              }}
              disabled={(date: Date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
            />
          </PopoverContent>
        </Popover>
        <input {...getInputProps(fields.dob, { type: 'hidden' })} />
        <div className="text-muted-foreground text-[0.8rem]">
          Your date of birth is used to calculate your age.
        </div>
        <div
          id={fields.dob.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.dob.errors}
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor={fields.language.id}>Language</Label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={fields.language.id}
              variant="outline"
              role="combobox"
              className={cn(
                'w-[200px] justify-between',
                !fields.language.value && 'text-muted-foreground',
              )}
            >
              {fields.language.value
                ? languages.find(
                    (language) => language.value === fields.language.value,
                  )?.label
                : 'Select language'}
              <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search language..." />
              <CommandEmpty>No language found.</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {languages.map((language) => (
                    <CommandItem
                      value={language.label}
                      key={language.value}
                      onSelect={(value) => {
                        const selectedLanguage = languages.find(
                          (lang) => lang.label === value,
                        )
                        if (!selectedLanguage) return
                        form.update({
                          name: fields.language.name,
                          value: selectedLanguage.value,
                        })
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          'h-4 w-4',
                          language.value === fields.language.value
                            ? 'opacity-100'
                            : 'opacity-0',
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
        <input {...getInputProps(fields.language, { type: 'hidden' })} />
        <div className="text-muted-foreground text-[0.8rem]">
          This is the language that will be used in the dashboard.
        </div>
        <div
          id={fields.language.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.language.errors}
        </div>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={navigation.state === 'submitting'}>
        Update account
      </Button>
    </Form>
  )
}
