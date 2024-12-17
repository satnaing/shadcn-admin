import { useEffect } from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
  useRouteError,
} from 'react-router'
import { getToast } from 'remix-toast'
import { toast } from 'sonner'
import { Toaster } from '~/components/ui/sonner'
import type { Route } from './+types/root'
import styles from './index.css?url'

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Shadcn Admin React Router v7' }]
}

export const links: Route.LinksFunction = () => {
  return [{ rel: 'stylesheet', href: styles }]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { toast, headers } = await getToast(request)
  return data({ toastData: toast }, { headers })
}

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="scroll-smooth">
        <Toaster closeButton richColors />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App({
  loaderData: { toastData },
}: Route.ComponentProps) {
  useEffect(() => {
    if (!toastData) {
      return
    }
    let toastFn = toast.info
    if (toastData.type === 'error') {
      toastFn = toast.error
    } else if (toastData.type === 'success') {
      toastFn = toast.success
    }
    toastFn(toastData.message, {
      description: toastData.description,
      position: 'top-right',
    })
  }, [toastData])

  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()

  let status = 0
  let statusText = ''
  let message = ''
  if (isRouteErrorResponse(error)) {
    status = error.status
    statusText = error.statusText
    message = error.data
  } else if (error instanceof Error) {
    status = 500
    statusText = 'Internal Server Error'
    message = error.message
  }

  return (
    <div className="m-8">
      <h1 className="text-4xl">
        {status} {statusText}
      </h1>
      <div className="mt-4">{message}</div>
    </div>
  )
}
