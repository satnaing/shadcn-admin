import { HTMLAttributes, useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
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
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: '请输入您的用户名' }),
  password: z
    .string()
    .min(1, {
      message: '请输入您的密码',
    })
    .min(5, {
      message: '密码长度至少为5个字符',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useAuthStore((state) => state.auth)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    // 如果用户已登录，则重定向到首页
    if (useAuthStore.getState().auth.user) {
      toast.success('您已登录, 正在跳转...', {
        duration: 2000,
      })
      const searchParams = new URLSearchParams(window.location.search)
      const redirectUrl = searchParams.get('redirect') || '/'
      navigate({ to: redirectUrl })
    }
  }, [useAuthStore.getState().auth.user])

  /**
   * 处理表单提交
   * @param data 表单数据
   */
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)

      // 调用登录API
      const response = await authService.login({
        username: data.email,
        password: data.password,
      })

      if (response.success) {
        // 登录成功处理
        toast.success('登录成功')

        // 获取用户信息
        const userInfo = await authService.getUserInfo()
        if (userInfo) {
          setUser(userInfo)
        }

        // 导航到首页或重定向的URL
        const searchParams = new URLSearchParams(window.location.search)
        const redirectUrl = searchParams.get('redirect') || '/'
        navigate({ to: redirectUrl })
      } else {
        // 登录失败处理
        toast.error(response.message || '登录失败', {
          duration: 5000,
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('登录过程中出错:', error)
      toast.error('登录过程中出错，请稍后再试')
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
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder='请输入用户名' {...field} />
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
              <FormLabel>密码</FormLabel>
              <FormControl>
                <PasswordInput placeholder='请输入密码' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75'
              >
                忘记密码?
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? '登录中...' : '登录'}
        </Button>

        <div className='relative my-2'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background text-muted-foreground px-2'>
              或继续使用
            </span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-2'>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandGithub className='h-4 w-4' /> GitHub
          </Button>
          <Button variant='outline' type='button' disabled={isLoading}>
            <IconBrandFacebook className='h-4 w-4' /> Facebook
          </Button>
        </div>
      </form>
    </Form>
  )
}
