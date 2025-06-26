import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { IconBrandGithub } from '@tabler/icons-react'
import { IconBrandGoogle } from '@tabler/icons-react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { useAuth } from '@/context/auth-context'
import { fetchUserInfoFromApi } from '@/utils/fetch-user-info'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { setUser } = useAuth()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // 1. Login and get JWT
      const response = await axios.post(`${BACKEND_BASE_URL}/v1/auth/login`, data)
      const token = response.data.token
      localStorage.setItem('token', token)
      // 2. Clear React Query cache and reset user context
      await queryClient.clear()
      setUser(null)
      // 3. Fetch user info with JWT
      const user = await fetchUserInfoFromApi(token)
      setUser(user)
      // 4. Redirect to dashboard or home (full reload to ensure fresh state)
      window.location.href = '/'
    } catch (_err) {
      // handle error (show toast, etc)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          Login
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              Or continue with
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button
            variant='outline'
            type='button'
            disabled={isLoading}
            onClick={() => {
 
 
              window.location.href = `${BACKEND_BASE_URL}/v1/auth/login/google`

            }}
          >
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button
            variant='outline'
            type='button'
            disabled={isLoading}
            onClick={() => {
 
 
              window.location.href = `${BACKEND_BASE_URL}/v1/auth/login/google`
            }}
          >
            <IconBrandGoogle className='h-4 w-4' /> Google
          </Button>
        </div>
      </form>
    </Form>
  )
}
