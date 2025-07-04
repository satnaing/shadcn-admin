import { Link } from '@tanstack/react-router'
import commentifyPreview from '@/assets/images/auth-preview.svg'
import commentifyLogo from '@/assets/images/logo.svg'
import { testimonialPeoples } from '@/components/layout/data/auth-page-data'
import AuthWrapper from '../auth-wrapper'
import { UserAuthForm } from './components/user-auth-form'

export default function SignIn2() {
  return (
    <AuthWrapper>
      <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r'>
          <div className='absolute inset-0 bg-zinc-900' />
          <div className='relative z-20 flex items-center text-lg font-medium'>
            <img src={commentifyLogo} className='relative' alt='commentify' />
          </div>

          <div className='relative z-20 m-auto'>
            <img
              src={commentifyPreview}
              className='max-w-[600px]'
              alt='Commfentify'
            />
            <div className='relative z-10 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5'>
              <div className='flex -space-x-2 sm:-space-x-4'>
                {testimonialPeoples.map((item) => (
                  <div className='relative' key={item.id}>
                    <div className='relative h-7 w-7 cursor-pointer rounded-full ring-2 ring-[#0A0A0A] sm:h-9 sm:w-9'>
                      <img
                        sizes='(max-width: 768px) 32px, 40px'
                        src={item.image}
                        className='h-full w-full rounded-full object-cover transition duration-500 hover:scale-105'
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className='max-w-[250px] text-center text-xs font-medium text-white sm:max-w-[250px] sm:text-left sm:text-xs'>
                Trusted by 1000+ founder and creators. No bots. No spam. Just
                real growth.
              </p>
            </div>
          </div>

          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;Clients started telling me they saw my name everywhere.
                That’s when I knew commentify was doing its job
                perfectly.&rdquo;
              </p>
              <footer className='text-sm'>Ethan R., CMO at GrowthX</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='mb-5 flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
              <p className='text-muted-foreground text-sm'>
                Not registered?{' '}
                <Link
                  to='/sign-up'
                  className='hover:text-primary underline underline-offset-4'
                >
                  Create an account
                </Link>
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </AuthWrapper>
  )
}
