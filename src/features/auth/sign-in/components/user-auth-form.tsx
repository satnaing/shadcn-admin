import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from '@tanstack/react-router'
// import { Link } from '@tanstack/react-router'
import { IconBrandGoogle } from '@tabler/icons-react'
import { Import } from 'lucide-react'
import { cn } from '@/lib/utils'
// import { Input } from '@/components/ui/input'
// import { PasswordInput } from '@/components/password-input'
import supabase from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Form, // FormControl,
  // FormField,
  // FormItem,
  // FormLabel,
  // FormMessage,
} from '@/components/ui/form'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    // eslint-disable-next-line no-console
    console.log(data)

    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}> */}
      <div className='grid gap-2'></div>
      <div className='relative my-2'>
        <Button
          variant='outline'
          className='w-full'
          type='button'
          disabled={isLoading}
          onClick={handleGoogleSignIn}
        >
          <IconBrandGoogle className='h-4 w-4' /> Google
        </Button>
      </div>
      {/* </form>
      </Form> */}
    </div>
  )
}

async function handleGoogleSignIn() {
  try {
    const baseUrl = import.meta.env.VITE_PUBLIC_SITE_URL
    if (!baseUrl) {
      alert('Base URL is not defined')
      return
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${baseUrl}/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      alert(error)
      // window.location.href = data.url;
      return
    }
    if (data.url) {
      console.log(data.url)
      // redirect({
      //   to: data.url,
      //   throw: true,
      // })
    }
    // window.open(data.url)
  } catch (error) {
    console.error(`Unexpected failure: ${error}`)
  }
}
