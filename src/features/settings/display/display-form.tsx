import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { showSubmittedData } from '@/lib/show-submitted-data'

const items = [
  {
    id: 'recents',
    label: 'Recents',
  },
  {
    id: 'home',
    label: 'Home',
  },
  {
    id: 'applications',
    label: 'Applications',
  },
  {
    id: 'desktop',
    label: 'Desktop',
  },
  {
    id: 'downloads',
    label: 'Downloads',
  },
  {
    id: 'documents',
    label: 'Documents',
  },
] as const

const displayFormSchema = z.object({
  items: z.array(z.string()).refine(value => value.some(item => item), {
    message: 'You have to select at least one item.',
  }),
})

export function DisplayForm() {
  const form = useForm({
    defaultValues: {
      items: ['recents', 'home'],
    },
    validators: {
      onSubmit: displayFormSchema,
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
      <form.Field name="items">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <div className="mb-4">
                <FieldLabel className="text-base">Sidebar</FieldLabel>
                <FieldDescription>
                  Select the items you want to display in the sidebar.
                </FieldDescription>
              </div>
              {items.map(item => (
                <Field
                  key={item.id}
                  className="flex flex-row items-center gap-2"
                  orientation="horizontal"
                >
                  <Checkbox
                    checked={field.state.value?.includes(item.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.handleChange([...field.state.value, item.id])
                        : field.handleChange(
                          field.state.value?.filter(
                            value => value !== item.id,
                          ),
                        )
                    }}
                  />
                  <FieldLabel className="font-normal leading-none">
                    {item.label}
                  </FieldLabel>
                </Field>
              ))}
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
            Update display
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
