import { createFileRoute, redirect } from '@tanstack/react-router'
import { PagePreview } from '@/features/pages'
import { useAuthStore } from '@/features/auth/data/auth.store'

export const Route = createFileRoute('/preview/$pageId')({
  validateSearch: (search: Record<string, unknown>) => ({
    lang: typeof search.lang === 'string' ? search.lang : 'az',
  }),
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken && !import.meta.env.DEV) {
      throw redirect({ to: '/sign-in', replace: true })
    }
  },
  component: PreviewRoute,
})

function PreviewRoute() {
  const { pageId } = Route.useParams()
  const { lang } = Route.useSearch()

  return <PagePreview pageId={Number(pageId)} lang={lang} />
}
