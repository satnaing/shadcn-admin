import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { Form, useNavigation } from 'react-router'
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

const baseSchema = z.object({
  firstName: z.string({ required_error: 'First Name is required.' }),
  lastName: z.string({ required_error: 'Last Name is required.' }),
  username: z.string({ required_error: 'Username is required.' }),
  phoneNumber: z.string({ required_error: 'Phone number is required.' }),
  email: z
    .string({ required_error: 'Email is required.' })
    .email({ message: 'Email is invalid.' }),
  role: z.enum(['superadmin', 'admin', 'manager', 'cashier']),
})

export const createSchema = baseSchema.merge(
  z.object({
    intent: z.literal('create'),
    password: z.string().transform((pwd) => pwd.trim()),
    confirmPassword: z.string().transform((pwd) => pwd.trim()),
  }),
)

export const editSchema = baseSchema.merge(
  z.object({ intent: z.literal('edit') }),
)

const formSchema = z
  .discriminatedUnion('intent', [createSchema, editSchema])
  .superRefine((arg, ctx) => {
    if (arg.intent !== 'create') {
      return
    }
    if (arg.password !== '') {
      if (arg.password === undefined) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password is required.',
          path: ['password'],
        })
        return
      }

      if (arg.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must be at least 8 characters long.',
          path: ['password'],
        })
      }

      if (!arg.password.match(/[a-z]/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one lowercase letter.',
          path: ['password'],
        })
      }

      if (!arg.password.match(/\d/)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Password must contain at least one number.',
          path: ['password'],
        })
      }

      if (arg.password !== arg.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords don't match.",
          path: ['confirmPassword'],
        })
      }
    }
  })

interface Props {
  user?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ user, open, onOpenChange }: Props) {
  const isEdit = !!user
  const [form, fields] = useForm({
    defaultValue: isEdit
      ? {
          ...user,
          password: '',
          confirmPassword: '',
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
        },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })
  const isPasswordTouched = fields.password.dirty
  const navigation = useNavigation()

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
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
        <ScrollArea className="-mr-4 w-full py-1 pr-4">
          <Form
            method="POST"
            {...getFormProps(form)}
            className="space-y-4 p-0.5"
          >
            <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
              <Label
                htmlFor={fields.firstName.id}
                className="col-span-2 text-right"
              >
                First Name
              </Label>
              <Input
                {...getInputProps(fields.firstName, { type: 'text' })}
                placeholder="John"
                className="col-span-4"
              />
              <div
                id={fields.firstName.errorId}
                className="text-destructive col-span-4 col-start-3 text-[0.8rem] font-medium empty:hidden"
              >
                {fields.firstName.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
              <Label
                htmlFor={fields.lastName.id}
                className="col-span-2 text-right"
              >
                Last Name
              </Label>
              <Input
                {...getInputProps(fields.lastName, { type: 'text' })}
                placeholder="Doe"
                className="col-span-4"
              />
              <div
                id={fields.lastName.errorId}
                className="text-destructive col-span-4 col-start-3 text-[0.8rem] font-medium empty:hidden"
              >
                {fields.lastName.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
              <Label
                htmlFor={fields.username.id}
                className="col-span-2 text-right"
              >
                Username
              </Label>
              <Input
                {...getInputProps(fields.username, { type: 'text' })}
                placeholder="john_doe"
                className="col-span-4"
              />
              <div
                id={fields.username.errorId}
                className="text-destructive col-span-4 col-start-3 text-[0.8rem] font-medium empty:hidden"
              >
                {fields.username.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
              <Label
                htmlFor={fields.email.id}
                className="col-span-2 text-right"
              >
                Email
              </Label>
              <Input
                {...getInputProps(fields.email, { type: 'email' })}
                placeholder="john.doe@gmail.com"
                className="col-span-4"
              />
              <div
                id={fields.email.errorId}
                className="text-destructive col-span-4 col-start-3 text-[0.8rem] font-medium empty:hidden"
              >
                {fields.email.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
              <Label
                htmlFor={fields.phoneNumber.id}
                className="col-span-2 text-right"
              >
                Phone Number
              </Label>
              <Input
                {...getInputProps(fields.phoneNumber, { type: 'tel' })}
                placeholder="+123456789"
                className="col-span-4"
              />
              <div
                id={fields.phoneNumber.errorId}
                className="text-destructive col-span-4 col-start-3 text-[0.8rem] font-medium empty:hidden"
              >
                {fields.phoneNumber.errors}
              </div>
            </div>

            <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
              <Label htmlFor={fields.role.id} className="col-span-2 text-right">
                Role
              </Label>
              <Select
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
                className="text-destructive col-span-4 col-start-3 text-[0.8rem] font-medium empty:hidden"
              >
                {fields.role.errors}
              </div>
            </div>

            {!isEdit && (
              <>
                <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                  <Label
                    htmlFor={fields.password.id}
                    className="col-span-2 text-right"
                  >
                    Password
                  </Label>
                  <PasswordInput
                    {...getInputProps(fields.password, { type: 'password' })}
                    placeholder="e.g., S3cur3P@ssw0rd"
                    className="col-span-4"
                  />
                  <div
                    id={fields.password.errorId}
                    className="text-destructive col-span-4 col-start-3 text-[0.8rem] font-medium empty:hidden"
                  >
                    {fields.password.errors}
                  </div>
                </div>

                <div className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
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
                    placeholder="e.g., S3cur3P@ssw0rd"
                    className="col-span-4"
                  />
                  <div
                    id={fields.confirmPassword.errorId}
                    className="text-destructive col-span-4 col-start-3 text-[0.8rem] font-medium empty:hidden"
                  >
                    {fields.confirmPassword.errors}
                  </div>
                </div>
              </>
            )}
          </Form>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="submit"
            form={form.id}
            name="intent"
            value={isEdit ? 'edit' : 'create'}
            disabled={navigation.state === 'submitting'}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
