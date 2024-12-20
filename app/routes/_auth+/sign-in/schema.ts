import { z } from 'zod'

export const formSchema = z.object({
  email: z
    .string({ required_error: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z.string({ required_error: 'Please enter your password' }).min(7, {
    message: 'Password must be at least 7 characters long',
  }),
})
