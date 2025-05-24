import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { useState } from 'react'
import { data, href } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import {
  UsersActionDialog,
  editSchema as formSchema,
} from '../_shared/components/users-action-dialog'
import { users } from '../_shared/data/users'
import type { Route } from './+types/route'

export const loader = ({ params }: Route.LoaderArgs) => {
  const user = users.find((u) => u.id === params.user)
  if (!user) {
    throw data(null, { status: 404 })
  }
  return { user }
}

export const action = async ({ request, params }: Route.ActionArgs) => {
  const url = new URL(request.url)
  const user = users.find((u) => u.id === params.user)
  if (!user) {
    throw data(null, { status: 404 })
  }

  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // Update the user
  await sleep(1000)
  const updatedUser = {
    ...submission.value,
    id: user.id,
    createdAt: user.createdAt,
    status: user.status,
    updatedAt: new Date(),
  }
  const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
  users.length = 0
  users.push(...updatedUsers)

  return redirectWithSuccess(`/users?${url.searchParams.toString()}`, {
    message: 'User updated successfully',
    description: JSON.stringify(updatedUser),
  })
}

export default function UserUpdate({
  loaderData: { user },
}: Route.ComponentProps) {
  const [open, setOpen] = useState(true)
  const { goBack } = useSmartNavigation({ baseUrl: href('/users') })
  return (
    <UsersActionDialog
      key={`user-edit-${user.id}`}
      user={user}
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(false)
          // wait for the modal to close
          setTimeout(() => {
            goBack()
          }, 300) // the duration of the modal close animation
        }
      }}
    />
  )
}
