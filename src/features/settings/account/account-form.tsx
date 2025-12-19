'use client'
import { useForm } from '@tanstack/react-form'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'
import { z } from 'zod'
import { DatePicker } from '@/components/date-picker'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'

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

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Please enter your name.')
    .min(2, 'Name must be at least 2 characters.')
    .max(30, 'Name must not be longer than 30 characters.'),
  dob: z.date('Please select your date of birth.'),
  language: z.string('Please select a language.'),
})

export function AccountForm() {
  const form = useForm({
    defaultValues: {
      name: '',
      dob: undefined as Date | undefined,
      language: '',
    },
    validators: {
      onSubmit: accountFormSchema,
    },
    onSubmit: async (values) => {
      showSubmittedData(values.value)
    },
  })

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-8"
    >
      <form.Field name="name">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Your name"
              />
              <FieldDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FieldDescription>
              {isInvalid && (
                <FieldError
                  errors={field.state.meta.errors?.map(err =>
                    typeof err === 'string' ? { message: err } : err,
                  )}
                />
              )}
            </Field>
          )
        }}
      </form.Field>

      <form.Field name="dob">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid} className="flex flex-col w-60">
              <FieldLabel>Date of birth</FieldLabel>
              <DatePicker
                selected={field.state.value}
                onSelect={date => field.handleChange(date)}
              />
              <FieldDescription>
                Your date of birth is used to calculate your age.
              </FieldDescription>
              {isInvalid && (
                <FieldError
                  errors={field.state.meta.errors?.map(err =>
                    typeof err === 'string' ? { message: err } : err,
                  )}
                />
              )}
            </Field>
          )
        }}
      </form.Field>

      <form.Field name="language">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid} className="flex flex-col w-50">
              <FieldLabel>Language</FieldLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'justify-between',
                      !field.state.value && 'text-muted-foreground',
                    )}
                  >
                    {field.state.value
                      ? languages.find(
                        language => language.value === field.state.value,
                      )?.label
                      : 'Select language'}
                    <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-50 p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {languages.map(language => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              field.handleChange(language.value)
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'size-4',
                                language.value === field.state.value
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
              <FieldDescription>
                This is the language that will be used in the dashboard.
              </FieldDescription>
              {isInvalid && (
                <FieldError
                  errors={field.state.meta.errors?.map(err =>
                    typeof err === 'string' ? { message: err } : err,
                  )}
                />
              )}
            </Field>
          )
        }}
      </form.Field>

      <form.Subscribe
        selector={formState => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            Update account
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
