import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
import type { HTMLAttributes } from 'react'
import { Form, Link, useActionData, useNavigation } from 'react-router'
import { PasswordInput } from '~/components/password-input'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import { formSchema, type action } from '../route'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const actionData = useActionData<typeof action>()
  const [form, { email, password }] = useForm({
    lastResult: actionData?.lastResult,
    defaultValue: {
      email: '',
      password: '',
    },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: formSchema }),
  })
  const navigation = useNavigation()
  const isLoading = navigation.state === 'submitting'

  return (
    <Form
      method="POST"
      {...getFormProps(form)}
      className={cn('grid gap-2', className)}
      {...props}
    >
      <div className="space-y-1">
        <Label htmlFor={email.id}>Email</Label>
        <Input
          {...getInputProps(email, { type: 'email' })}
          key={email.key}
          placeholder="name@example.com"
        />
        <div
          id={email.errorId}
          className="text-[0.8rem] font-medium text-destructive empty:hidden"
        >
          {email.errors}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor={password.id}>Password</Label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-muted-foreground hover:opacity-75"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          {...getInputProps(password, { type: 'password' })}
          key={password.key}
          placeholder="********"
        />
        <div
          id={password.errorId}
          className="text-[0.8rem] font-medium text-destructive empty:hidden"
        >
          {password.errors}
        </div>
      </div>

      {form.errors && (
        <Alert variant="destructive">
          <AlertTitle>Login Error</AlertTitle>
          <AlertDescription>{form.errors}</AlertDescription>
        </Alert>
      )}

      <Button className="mt-2" disabled={isLoading}>
        Login
      </Button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={isLoading}
        >
          <IconBrandGithub className="h-4 w-4" /> GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          type="button"
          disabled={isLoading}
        >
          <IconBrandFacebook className="h-4 w-4" /> Facebook
        </Button>
      </div>
    </Form>
  )
}
