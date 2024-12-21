import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { useState } from 'react'
import { data, useNavigate } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
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
  const updateUser = {
    ...submission.value,
    id: user.id,
    createdAt: user.createdAt,
    status: user.status,
    updatedAt: new Date(),
  } as const
  users[users.indexOf(user)] = updateUser

  return redirectWithSuccess('/users', {
    message: 'User updated successfully',
    description: JSON.stringify(updateUser),
  })
}

export default function UserUpdate({
  loaderData: { user },
}: Route.ComponentProps) {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

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
            navigate('/users')
          }, 300) // the duration of the modal close animation
        }
      }}
    />
  )
}
