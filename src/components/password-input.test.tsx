import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { userEvent } from 'vitest/browser'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { PasswordInput } from './password-input'

describe('PasswordInput', () => {
  it('renders the password input correctly', async () => {
    const { getByPlaceholder, getByRole } = await render(
      <PasswordInput placeholder='password' />
    )

    const passwordInput = getByPlaceholder('password')
    const showPasswordButton = getByRole('button', { name: /show password/i })

    await expect.element(passwordInput).toBeInTheDocument()
    await expect.element(passwordInput).toHaveAttribute('type', 'password')
    await expect.element(showPasswordButton).toBeVisible()
  })

  it('toggles the password visibility when the show password button is clicked', async () => {
    const { getByPlaceholder, getByRole } = await render(
      <PasswordInput placeholder='password' />
    )

    const passwordInput = getByPlaceholder('password')
    const showPasswordButton = getByRole('button', { name: /show password/i })

    await expect.element(passwordInput).toHaveAttribute('type', 'password')
    await expect.element(showPasswordButton).toBeInTheDocument()

    await userEvent.click(showPasswordButton)

    await expect.element(passwordInput).toHaveAttribute('type', 'text')
    const hidePasswordButton = getByRole('button', { name: /hide password/i })
    await expect.element(hidePasswordButton).toBeInTheDocument()

    await userEvent.click(hidePasswordButton)

    await expect.element(passwordInput).toHaveAttribute('type', 'password')
    await expect
      .element(getByRole('button', { name: /show password/i }))
      .toBeInTheDocument()
  })

  it('disables the show password button when the password input is disabled', async () => {
    const { getByPlaceholder, getByRole } = await render(
      <PasswordInput placeholder='password' disabled />
    )

    const passwordInput = getByPlaceholder('password')
    const showPasswordButton = getByRole('button', { name: /show password/i })
    await expect.element(showPasswordButton).toBeDisabled()
    await expect.element(passwordInput).toBeDisabled()
  })

  it('works with FormLabel and react-hook-form field spread', async () => {
    function PasswordInLabeledForm() {
      const form = useForm<{ password: string }>({
        defaultValues: { password: '' },
      })

      return (
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      )
    }

    const { getByLabelText } = await render(<PasswordInLabeledForm />)

    const password = getByLabelText(/^Password$/i)
    await expect.element(password).toHaveAttribute('type', 'password')

    await userEvent.type(password, 'secret-value')

    await expect.element(password).toHaveValue('secret-value')
  })
})
