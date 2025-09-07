import { createFileRoute, Outlet } from '@tanstack/react-router'
import { SwanLogo } from '@/components/swan-logo'

export const Route = createFileRoute('/(auth)')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center'>
      <div className='w-full max-w-md px-4'>
        {/* Logo Section */}
        <div className='mb-8 items-center'>
          <SwanLogo className='h-12' />
        </div>

        {/* Auth Content */}
        <div className='z-100'>
          <Outlet />
        </div>

        {/* Footer */}
        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-500'>GTM at the speed of thought</p>
        </div>
      </div>
    </div>
  )
}
