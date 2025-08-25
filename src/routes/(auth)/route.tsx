import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)')({
  component: ClerkAuthLayout,
})

function ClerkAuthLayout() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md px-4'>
        {/* Logo Section */}
        <div className='mb-8 items-center'>
          <img 
            src='/images/swan_logo_with_wordmark_black.png' 
            alt='Swan Logo' 
            className='h-12 mx-auto'
          />
        </div>

        {/* Auth Content */}
        <div >
          <Outlet />
        </div>

        {/* Footer */}
        <div className='mt-8 text-center'>
          <p className='text-sm text-gray-500'>
            Identify, qualify, and convert leads showing intent
          </p>
        </div>
      </div>
    </div>
  )
}
