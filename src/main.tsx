import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { handleServerError } from '@/lib/handle-server-error'
import { DirectionProvider } from './context/direction-provider'
import { FontProvider } from './context/font-provider'
import { ThemeProvider } from './context/theme-provider'
// Generated Routes
import { routeTree } from './routeTree.gen'
// Internalization
import './shared/i18n'
// Styles
import './styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error })

        if (failureCount >= 0 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 60 * 1000, // 60s — panel sürət büdcəsi (task/admin/00-baseline.md §14.2)
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)
      },
    },
  },
  queryCache: new QueryCache({
    onError: () => {
      // Global unhandled errors can still be caught here if needed,
      // but Axios Interceptor handles 401, 500, 304 etc.
    },
  }),
})

/*
 * A deploy renames every lazy chunk. A tab that is already open still asks for
 * the old names, the SPA rewrite answers with index.html, and the import dies
 * on the HTML MIME type. Reload once so the tab picks up the new build —
 * guarded by a session flag so a genuinely broken chunk cannot loop.
 */
const RELOAD_FLAG = 'chunk-reload-attempted'

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()

  try {
    if (sessionStorage.getItem(RELOAD_FLAG)) return
    sessionStorage.setItem(RELOAD_FLAG, '1')
  } catch {
    // Private mode / blocked storage: reloading once is still the better bet.
  }

  window.location.reload()
})

window.addEventListener('load', () => {
  try {
    sessionStorage.removeItem(RELOAD_FLAG)
  } catch {
    // Nothing to clear when storage is unavailable.
  }
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FontProvider>
            <DirectionProvider>
              <RouterProvider router={router} />
            </DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
