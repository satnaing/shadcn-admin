import { createFileRoute, redirect } from '@tanstack/react-router'
import supabase from '@/utils/supabase/client'

export const Route = createFileRoute('/(auth)/callback')({
  loader: async (args) => {
    // console.log('args', args)
    const auth = args.location.hash
      .split('&')
      .reduce<Record<string, string>>((acc, pair) => {
        const [key, value] = pair.split('=')
        acc[key] = value
        return acc
      }, {})

    console.log(auth)
    if (!auth.access_token || !auth.refresh_token) {
      throw new Error('Missing access_token or refresh_token')
    }
    const { data, error } = await supabase.auth.setSession({
      access_token: auth.access_token,
      refresh_token: auth.refresh_token,
    })
    console.log(data)
    if (error) {
      throw new Error(error.message)
    }
    return redirect({ to: '/' })
  },
  // component: AuthCallback,
  // ssr: true,
})

export function AuthCallback() {
  const data = Route.useLoaderData()
  console.log(data)
  // return redirect({ to: '/' })
  return (
    <div>
      <h1>Auth Callback</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
