'use client'

import { z } from 'zod'
import { useForm } from '@tanstack/react-form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { roles } from '../data/data'
import { type User } from '../data/schema'

const formSchema = z
  .object({
    firstName: z.string().min(1, 'First Name is required.'),
    lastName: z.string().min(1, 'Last Name is required.'),
    username: z.string().min(1, 'Username is required.'),
    phoneNumber: z.string().min(1, 'Phone number is required.'),
    email: z.email({
      error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
    }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, 'Role is required.'),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .refine(
    (data) => {
      if (data.isEdit && !data.password) return true
      return data.password.length > 0
    },
    {
      message: 'Password is required.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return password.length >= 8
    },
    {
      message: 'Password must be at least 8 characters long.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /[a-z]/.test(password)
    },
    {
      message: 'Password must contain at least one lowercase letter.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password }) => {
      if (isEdit && !password) return true
      return /\d/.test(password)
    },
    {
      message: 'Password must contain at least one number.',
      path: ['password'],
    }
  )
  .refine(
    ({ isEdit, password, confirmPassword }) => {
      if (isEdit && !password) return true
      return password === confirmPassword
    },
    {
      message: "Passwords don't match.",
      path: ['confirmPassword'],
    }
  )
type UserForm = z.infer<typeof formSchema>

type UserActionDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow
  const form = useForm({
    defaultValues: isEdit
      ? ({
          ...currentRow,
          password: '',
          confirmPassword: '',
          isEdit,
        } as UserForm)
      : ({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isEdit,
        } as UserForm),
    validators: {
      onChange: formSchema,
    },
    onSubmit: async ({ value }) => {
      form.reset()
      showSubmittedData(value)
      onOpenChange(false)
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <form
            id='user-form'
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className='space-y-4 px-0.5'
          >
            <form.Field name='firstName'>
              {(field) => (
                <Field
                  className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'
                  data-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                >
                  <FieldLabel className='col-span-2 text-end'>
                    First Name
                  </FieldLabel>
                  <Input
                    placeholder='John'
                    className='col-span-4'
                    autoComplete='off'
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError
                    className='col-span-4 col-start-3'
                    errors={field.state.meta.errors}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='lastName'>
              {(field) => (
                <Field
                  className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'
                  data-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                >
                  <FieldLabel className='col-span-2 text-end'>
                    Last Name
                  </FieldLabel>
                  <Input
                    placeholder='Doe'
                    className='col-span-4'
                    autoComplete='off'
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError
                    className='col-span-4 col-start-3'
                    errors={field.state.meta.errors}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='username'>
              {(field) => (
                <Field
                  className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'
                  data-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                >
                  <FieldLabel className='col-span-2 text-end'>
                    Username
                  </FieldLabel>
                  <Input
                    placeholder='john_doe'
                    className='col-span-4'
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError
                    className='col-span-4 col-start-3'
                    errors={field.state.meta.errors}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='email'>
              {(field) => (
                <Field
                  className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'
                  data-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                >
                  <FieldLabel className='col-span-2 text-end'>Email</FieldLabel>
                  <Input
                    placeholder='john.doe@gmail.com'
                    className='col-span-4'
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError
                    className='col-span-4 col-start-3'
                    errors={field.state.meta.errors}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='phoneNumber'>
              {(field) => (
                <Field
                  className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'
                  data-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                >
                  <FieldLabel className='col-span-2 text-end'>
                    Phone Number
                  </FieldLabel>
                  <Input
                    placeholder='+123456789'
                    className='col-span-4'
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError
                    className='col-span-4 col-start-3'
                    errors={field.state.meta.errors}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='role'>
              {(field) => (
                <Field
                  className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'
                  data-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                >
                  <FieldLabel className='col-span-2 text-end'>Role</FieldLabel>
                  <SelectDropdown
                    defaultValue={field.state.value}
                    onValueChange={field.handleChange}
                    placeholder='Select a role'
                    className='col-span-4'
                    items={roles.map(({ label, value }) => ({
                      label,
                      value,
                    }))}
                  />
                  <FieldError
                    className='col-span-4 col-start-3'
                    errors={field.state.meta.errors}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='password'>
              {(field) => (
                <Field
                  className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'
                  data-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                >
                  <FieldLabel className='col-span-2 text-end'>
                    Password
                  </FieldLabel>
                  <PasswordInput
                    placeholder='e.g., S3cur3P@ssw0rd'
                    className='col-span-4'
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError
                    className='col-span-4 col-start-3'
                    errors={field.state.meta.errors}
                  />
                </Field>
              )}
            </form.Field>

            <form.Field name='confirmPassword'>
              {(field) => (
                <Field
                  className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'
                  data-invalid={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                >
                  <FieldLabel className='col-span-2 text-end'>
                    Confirm Password
                  </FieldLabel>
                  <PasswordInput
                    disabled={!form.state.values.password && !isEdit}
                    placeholder='e.g., S3cur3P@ssw0rd'
                    className='col-span-4'
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError
                    className='col-span-4 col-start-3'
                    errors={field.state.meta.errors}
                  />
                </Field>
              )}
            </form.Field>
          </form>
        </div>
        <DialogFooter>
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type='submit'
                form='user-form'
                disabled={!canSubmit || isSubmitting}
              >
                Save changes
              </Button>
            )}
          </form.Subscribe>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
