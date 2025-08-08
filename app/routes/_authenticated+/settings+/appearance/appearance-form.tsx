import { getFormProps, getSelectProps, useForm } from '@conform-to/react'
import { parseWithZod } from "@conform-to/zod/v4"
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { Form, useActionData, useNavigation } from 'react-router'
import type { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button, buttonVariants } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { cn } from '~/lib/utils'
import { appearanceFormSchema, type action } from './route'

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

// This can come from your database or API.
const defaultValue: Partial<AppearanceFormValues> = {
  theme: 'light',
}

export function AppearanceForm() {
  const actionData = useActionData<typeof action>()
  const [form, fields] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: appearanceFormSchema }),
  })
  const navigation = useNavigation()

  return (
    <Form method="POST" {...getFormProps(form)} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor={fields.font.id}>Font</Label>
        <div className="relative w-max">
          <select
            {...getSelectProps(fields.font)}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'w-[200px] appearance-none font-normal',
            )}
          >
            <option value="inter">Inter</option>
            <option value="manrope">Manrope</option>
            <option value="system">System</option>
          </select>
          <ChevronDownIcon className="absolute top-2.5 right-3 h-4 w-4 opacity-50" />
        </div>
        <div className="text-muted-foreground text-[0.8rem]">
          Set the font you want to use in the dashboard.
        </div>
        <div
          id={fields.font.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.font.errors}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor={fields.theme.id}>Theme</Label>
        <div className="text-muted-foreground text-[0.8rem]">
          Select the theme for the dashboard.
        </div>

        <RadioGroup
          id={fields.theme.id}
          name={fields.theme.name}
          onValueChange={(value) => {
            form.update({
              name: fields.theme.name,
              value,
            })
          }}
          defaultValue={fields.theme.value}
          className="grid max-w-md grid-cols-2 gap-8 pt-2"
        >
          <Label className="[&:has([data-state=checked])>div]:border-primary">
            <RadioGroupItem value="light" className="sr-only">
              Light
            </RadioGroupItem>

            <div className="border-muted hover:border-accent items-center rounded-md border-2 p-1">
              <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
                <div className="space-y-2 rounded-md bg-white p-2 shadow-xs">
                  <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-xs">
                  <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                  <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Light
            </span>
          </Label>

          <Label className="[&:has([data-state=checked])>div]:border-primary">
            <RadioGroupItem value="dark" className="sr-only">
              Dark
            </RadioGroupItem>
            <div className="border-muted bg-popover hover:bg-accent hover:text-accent-foreground items-center rounded-md border-2 p-1">
              <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-xs">
                  <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
                <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-xs">
                  <div className="h-4 w-4 rounded-full bg-slate-400" />
                  <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                </div>
              </div>
            </div>
            <span className="block w-full p-2 text-center font-normal">
              Dark
            </span>
          </Label>
        </RadioGroup>
        <div
          id={fields.theme.errorId}
          className="text-destructive text-[0.8rem] font-medium empty:hidden"
        >
          {fields.theme.errors}
        </div>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={navigation.state === 'submitting'}>
        Update preferences
      </Button>
    </Form>
  )
}
