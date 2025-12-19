import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Link } from '@tanstack/react-router'

const profileFormSchema = z.object({
  username: z
    .string('Please enter your username.')
    .min(2, 'Username must be at least 2 characters.')
    .max(30, 'Username must not be longer than 30 characters.'),
  email: z.email({
    error: iss =>
      iss.input === undefined
        ? 'Please select an email to display.'
        : undefined,
  }),
  bio: z.string().max(160).min(4),
  urls: z.array(
    z.object({
      value: z.url('Please enter a valid URL.'),
    }),
  ),
})

export function ProfileForm() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      bio: 'I own a computer.',
      urls: [
        { value: 'https://shadcn.com' },
        { value: 'http://twitter.com/shadcn' },
      ],
    },
    validators: {
      onSubmit: profileFormSchema,
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
      <form.Field name="username">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Username</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="shadcn"
              />
              <FieldDescription>
                This is your public display name. It can be your real name or a
                pseudonym. You can only change this once every 30 days.
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
      <form.Field name="email">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel>Email</FieldLabel>
              <Select onValueChange={field.handleChange} defaultValue={field.state.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a verified email to display" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                You can manage verified email addresses in your
                {' '}
                <Link to="/">email settings</Link>
                .
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
      <form.Field name="bio">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={e => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Tell us a little bit about yourself"
                className="resize-none"
              />
              <FieldDescription>
                You can
                {' '}
                <span>@mention</span>
                {' '}
                other users and organizations to
                link to them.
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
      <form.Field name="urls" mode="array">
        {(field) => {
          return (
            <div>
              {field.state.value?.map((_, index) => (
                <form.Field key={index} name={`urls[${index}].value`}>
                  {(subField) => {
                    const isInvalid = subField.state.meta.isTouched && !subField.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel className={cn(index !== 0 && 'sr-only')}>
                          URLs
                        </FieldLabel>
                        <FieldDescription className={cn(index !== 0 && 'sr-only')}>
                          Add links to your website, blog, or social media profiles.
                        </FieldDescription>
                        <Input
                          name={subField.name}
                          value={subField.state.value}
                          onBlur={subField.handleBlur}
                          onChange={e => subField.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          className={cn(index !== 0 && 'mt-1.5')}
                        />
                        {isInvalid && (
                          <FieldError
                            errors={subField.state.meta.errors?.map(err =>
                              typeof err === 'string' ? { message: err } : err,
                            )}
                          />
                        )}
                      </Field>
                    )
                  }}
                </form.Field>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => field.pushValue({ value: '' })}
              >
                Add URL
              </Button>
            </div>
          )
        }}
      </form.Field>

      <form.Subscribe
        selector={formState => [formState.canSubmit, formState.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit || isSubmitting}>
            Update profile
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
