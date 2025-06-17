import { Outlet, useLocation } from 'react-router'

export default function AuthLayout() {
  const pathname = useLocation().pathname
  if (pathname === '/sign-in-2') {
    return <Outlet />
  }

  return (
    <div className="bg-primary-foreground grid h-svh">
      <div className="container mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
        <div className="mb-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <h1 className="text-xl font-medium">Shadcn Admin</h1>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
