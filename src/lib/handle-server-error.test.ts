import { AxiosError } from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { handleServerError } from './handle-server-error'

const toastError = vi.hoisted(() => vi.fn())

vi.mock('sonner', () => ({
  toast: {
    error: toastError,
  },
}))

beforeEach(() => {
  vi.mocked(toastError).mockClear()
})

describe('handleServerError', () => {
  it('shows a generic message when the error is not recognised', () => {
    handleServerError(new Error('network'))

    expect(toastError).toHaveBeenCalledWith('Something went wrong!')
  })

  it('shows a not-found style message for a 204 status payload', () => {
    handleServerError({ status: 204 })

    expect(toastError).toHaveBeenCalledWith('Content not found.')
  })

  it('prefers the API title when the error is an Axios error with response data', () => {
    const error = new AxiosError('Bad request')
    error.response = {
      status: 422,
      data: { title: 'Validation failed' },
    } as AxiosError['response']

    handleServerError(error)

    expect(toastError).toHaveBeenCalledWith('Validation failed')
  })
})
