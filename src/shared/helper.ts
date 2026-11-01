import axios from 'axios'
import { toast } from 'sonner'

export const getInitials = (name?: string | null) =>
  (
    name
      ?.match(/\b\p{L}/gu)
      ?.slice(0, 2)
      .join('') ?? ''
  ).toUpperCase()

export class BulkDeleteError extends Error {
  failed: string[]

  constructor(message: string, failed: string[]) {
    super(message)
    this.name = 'BulkDeleteError'
    this.failed = failed
  }
}

export async function asyncRequest(cb: () => Promise<unknown>) {
  try {
    await cb()
    toast.success('Success!')
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        toast.error(
          error.code === 'ERR_NETWORK'
            ? 'Network/CORS error — check API URL and allowed origins.'
            : error.message || 'An error occurred'
        )
        return
      }

      const message = error.response?.data?.message || 'An error occurred'

      if (Array.isArray(message)) {
        message.forEach((m: string) => toast.error(m))
      } else {
        toast.error(message)
      }
    } else if (error instanceof Error) {
      toast.error(error.message || 'An error occurred')
    }
  }
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null
}
