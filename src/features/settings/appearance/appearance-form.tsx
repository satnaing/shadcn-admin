import { z } from 'zod'
import { fonts } from '@/config/fonts'
import { useForm } from '@tanstack/react-form'
import { ChevronDownIcon } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { useFont } from '@/context/font-provider'
import { useTheme } from '@/context/theme-provider'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const appearanceFormSchema = z.object({
  theme: z.enum(['light', 'dark']),
  font: z.enum(fonts),
})

export function AppearanceForm() {
  const { font, setFont } = useFont()
  const { theme, setTheme } = useTheme()

  const form = useForm({
    defaultValues: {
      theme: (theme as 'light' | 'dark') || 'light',
      font: font || fonts[0],
    },
    validators: {
      onSubmit: appearanceFormSchema,
    },
    onSubmit: async (values) => {
      const data = values.value
      if (data.font !== font) setFont(data.font)
      if (data.theme !== theme) setTheme(data.theme)

      showSubmittedData(data)
    },
  })

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault()
        form.handleSubmit()
      }}
      className='space-y-8'
    >
      <form.Field name='font'>
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel>Font</FieldLabel>
              <div className='relative w-max'>
                <select
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'w-[200px] appearance-none font-normal capitalize',
                    'dark:bg-background dark:hover:bg-background'
                  )}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(e.target.value as (typeof fonts)[number])
                  }
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                >
                  {fonts.map((fontItem: string) => (
                    <option key={fontItem} value={fontItem}>
                      {fontItem}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className='absolute end-3 top-2.5 h-4 w-4 opacity-50' />
              </div>
              <FieldDescription className='font-manrope'>
                Set the font you want to use in the dashboard.
              </FieldDescription>
              {isInvalid && (
                <FieldError
                  errors={field.state.meta.errors?.map((err) =>
                    typeof err === 'string' ? { message: err } : err
                  )}
                />
              )}
            </Field>
          )
        }}
      </form.Field>
      <form.Field name='theme'>
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel>Theme</FieldLabel>
              <FieldDescription>
                Select the theme for the dashboard.
              </FieldDescription>
              {isInvalid && (
                <FieldError
                  errors={field.state.meta.errors?.map((err) =>
                    typeof err === 'string' ? { message: err } : err
                  )}
                />
              )}
              <RadioGroup
                onValueChange={(value) =>
                  field.handleChange(value as 'light' | 'dark')
                }
                defaultValue={field.state.value}
                className='grid max-w-md grid-cols-2 gap-8 pt-2'
              >
                <Field orientation='horizontal'>
                  <FieldLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <RadioGroupItem value='light' className='sr-only' />
                    <div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
                      <div className='space-y-2 rounded-sm bg-[#ecedef] p-2'>
                        <div className='space-y-2 rounded-md bg-white p-2 shadow-xs'>
                          <div className='h-2 w-[80px] rounded-lg bg-[#ecedef]' />
                          <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                          <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-[#ecedef]' />
                          <div className='h-2 w-[100px] rounded-lg bg-[#ecedef]' />
                        </div>
                      </div>
                    </div>
                    <span className='block w-full p-2 text-center font-normal'>
                      Light
                    </span>
                  </FieldLabel>
                </Field>
                <Field orientation='horizontal'>
                  <FieldLabel className='[&:has([data-state=checked])>div]:border-primary'>
                    <RadioGroupItem value='dark' className='sr-only' />
                    <div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground'>
                      <div className='space-y-2 rounded-sm bg-slate-950 p-2'>
                        <div className='space-y-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                          <div className='h-2 w-20 rounded-lg bg-slate-400' />
                          <div className='h-2 w-25 rounded-lg bg-slate-400' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-slate-400' />
                          <div className='h-2 w-25 rounded-lg bg-slate-400' />
                        </div>
                        <div className='flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs'>
                          <div className='h-4 w-4 rounded-full bg-slate-400' />
                          <div className='h-2 w-25 rounded-lg bg-slate-400' />
                        </div>
                      </div>
                    </div>
                    <span className='block w-full p-2 text-center font-normal'>
                      Dark
                    </span>
                  </FieldLabel>
                </Field>
              </RadioGroup>
            </Field>
          )
        }}
      </form.Field>

      <form.Subscribe
        selector={(formState) => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type='submit' disabled={!canSubmit || isSubmitting}>
            Update preferences
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
