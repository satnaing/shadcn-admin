import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, type RenderResult } from 'vitest-browser-react'
import { type Locator, userEvent } from 'vitest/browser'
import { SignUpForm } from './sign-up-form'

const FORM_MESSAGES = {
  emailEmpty: 'Please enter your email.',
  passwordEmpty: 'Please enter your password.',
  confirmPasswordEmpty: 'Please confirm your password.',
  passwordMismatch: "Passwords don't match.",
} as const

const toastPromise = vi.hoisted(() =>
  vi.fn((p: Promise<unknown>, opts: { success?: () => unknown }) => {
    p.then(() => opts.success?.())
  })
)

vi.mock('sonner', () => ({ toast: { promise: toastPromise } }))

describe('SignUpForm', () => {
  let screen: RenderResult
  let emailInput: Locator
  let passwordInput: Locator
  let confirmPasswordInput: Locator
  let submitButton: Locator

  beforeEach(async () => {
    vi.clearAllMocks()

    screen = await render(<SignUpForm />)
    emailInput = screen.getByRole('textbox', { name: /^Email$/i })
    passwordInput = screen.getByLabelText(/^Password$/i)
    confirmPasswordInput = screen.getByLabelText(/^Confirm Password$/i)
    submitButton = screen.getByRole('button', { name: /^Create Account$/i })
  })

  it('renders fields and submit button', async () => {
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
    expect(confirmPasswordInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()
  })

  it('shows validation messages when submitting empty form', async () => {
    await userEvent.click(submitButton)

    expect(screen.getByText(FORM_MESSAGES.emailEmpty)).toBeInTheDocument()
    expect(screen.getByText(FORM_MESSAGES.passwordEmpty)).toBeInTheDocument()
    expect(
      screen.getByText(FORM_MESSAGES.confirmPasswordEmpty)
    ).toBeInTheDocument()
  })

  it('shows a mismatch error when passwords do not match', async () => {
    await userEvent.fill(emailInput, 'a@b.com')
    await userEvent.fill(passwordInput, '1234567')
    await userEvent.fill(confirmPasswordInput, '7654321')

    await userEvent.click(submitButton)
    expect(screen.getByText(FORM_MESSAGES.passwordMismatch)).toBeInTheDocument()
  })

  it('disables submit while submitting and re-enables after timeout', async () => {
    vi.useFakeTimers()

    await userEvent.fill(emailInput, 'a@b.com')
    await userEvent.fill(passwordInput, '1234567')
    await userEvent.fill(confirmPasswordInput, '1234567')

    await userEvent.click(submitButton)
    expect(submitButton).toBeDisabled()

    await vi.advanceTimersByTimeAsync(2000)
    await vi.waitFor(() => expect(submitButton).toBeEnabled())
    expect(toastPromise).toHaveBeenCalledOnce()
  })
})
