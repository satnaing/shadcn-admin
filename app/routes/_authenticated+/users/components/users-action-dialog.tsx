import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { PasswordInput } from '~/components/password-input'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { userTypes } from '../data/data'
import type { User } from '../data/schema'

const formSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First Name is required.' }),
    lastName: z.string().min(1, { message: 'Last Name is required.' }),
    username: z.string().min(1, { message: 'Username is required.' }),
    phoneNumber: z.string().min(1, { message: 'Phone number is required.' }),
    email: z
      .string()
      .min(1, { message: 'Email is required.' })
      .email({ message: 'Email is invalid.' }),
    password: z.string().transform((pwd) => pwd.trim()),
    role: z.string().min(1, { message: 'Role is required.' }),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
    isEdit: z.boolean(),
  })
  .superRefine(({ isEdit, password, confirmPassword }, ctx) => {
    if (!isEdit || (isEdit && password !== '')) {
      if (password === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required.',
          path: ['password'],
        })
      }

      if (password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 8 characters long.',
          path: ['password'],
        })
      }

      if (!password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one lowercase letter.',
          path: ['password'],
        })
      }

      if (!password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one number.',
          path: ['password'],
        })
      }

      if (password !== confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ['confirmPassword'],
        })
      }
    }
  })

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const [form, fields] = useForm({
    defaultValue: isEdit
      ? {
          ...currentRow,
          password: '',
          confirmPassword: '',
          isEdit,
        }
      : {
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          role: '',
          phoneNumber: '',
          password: '',
          confirmPassword: '',
          isEdit,
        },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
    onSubmit: (event, { submission }) => {
      event.preventDefault()
      if (submission?.status !== 'success') return
      form.reset()
      toast('You submitted the following values:', {
        description: (
          <pre className="mt-2 w-[320px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(submission.value, null, 2)}
            </code>
          </pre>
        ),
      })
      onOpenChange(false)
    },
  })

  const isPasswordTouched = fields.password.dirty

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 h-[26.25rem] w-full py-1 pr-4">
          <Form {...getFormProps(form)} className="space-y-4 p-0.5">
            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label
                htmlFor={fields.firstName.id}
                className="col-span-2 text-right"
              >
                First Name
              </Label>
              <Input
                {...getInputProps(fields.firstName, { type: 'text' })}
                key={fields.firstName.key}
                placeholder="John"
                className="col-span-4"
              />
              <div
                id={fields.firstName.errorId}
                className="col-span-4 col-start-3 text-sm text-destructive"
              >
                {fields.firstName.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label
                htmlFor={fields.lastName.id}
                className="col-span-2 text-right"
              >
                Last Name
              </Label>
              <Input
                {...getInputProps(fields.lastName, { type: 'text' })}
                key={fields.lastName.key}
                placeholder="Doe"
                className="col-span-4"
              />
              <div
                id={fields.lastName.errorId}
                className="col-span-4 col-start-3 text-sm text-destructive"
              >
                {fields.lastName.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label
                htmlFor={fields.username.id}
                className="col-span-2 text-right"
              >
                Username
              </Label>
              <Input
                {...getInputProps(fields.username, { type: 'text' })}
                key={fields.username.key}
                placeholder="john_doe"
                className="col-span-4"
              />
              <div
                id={fields.username.errorId}
                className="col-span-4 col-start-3 text-sm text-destructive"
              >
                {fields.username.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label
                htmlFor={fields.email.id}
                className="col-span-2 text-right"
              >
                Email
              </Label>
              <Input
                {...getInputProps(fields.email, { type: 'email' })}
                key={fields.email.key}
                placeholder="john.doe@gmail.com"
                className="col-span-4"
              />
              <div
                id={fields.email.errorId}
                className="col-span-4 col-start-3 text-sm text-destructive"
              >
                {fields.email.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label
                htmlFor={fields.phoneNumber.id}
                className="col-span-2 text-right"
              >
                Phone Number
              </Label>
              <Input
                {...getInputProps(fields.phoneNumber, { type: 'tel' })}
                key={fields.phoneNumber.key}
                placeholder="+123456789"
                className="col-span-4"
              />
              <div
                id={fields.phoneNumber.errorId}
                className="col-span-4 col-start-3 text-sm text-destructive"
              >
                {fields.phoneNumber.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label htmlFor={fields.role.id} className="col-span-2 text-right">
                Role
              </Label>
              <Select
                key={fields.role.key}
                name={fields.role.name}
                defaultValue={fields.role.initialValue}
                onValueChange={(value) => {
                  form.update({
                    name: fields.role.name,
                    value,
                  })
                }}
              >
                <SelectTrigger id={fields.role.id} className="col-span-4">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div
                id={fields.email.errorId}
                className="col-span-4 col-start-3 text-sm text-destructive"
              >
                {fields.role.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label
                htmlFor={fields.password.id}
                className="col-span-2 text-right"
              >
                Password
              </Label>
              <PasswordInput
                {...getInputProps(fields.password, { type: 'password' })}
                key={fields.password.key}
                placeholder="e.g., S3cur3P@ssw0rd"
                className="col-span-4"
              />
              <div
                id={fields.password.errorId}
                className="col-span-4 col-start-3 text-sm text-destructive"
              >
                {fields.password.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center gap-x-4 gap-y-1 space-y-0">
              <Label
                htmlFor={fields.confirmPassword.id}
                className="col-span-2 text-right"
              >
                Confirm Password
              </Label>
              <PasswordInput
                disabled={!isPasswordTouched}
                {...getInputProps(fields.confirmPassword, {
                  type: 'password',
                })}
                key={fields.confirmPassword.key}
                placeholder="e.g., S3cur3P@ssw0rd"
                className="col-span-4"
              />
              <div
                id={fields.confirmPassword.errorId}
                className="col-span-4 col-start-3 text-sm text-destructive"
              >
                {fields.confirmPassword.errors}
              </div>
            </div>
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" form={form.id}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
