import { setTimeout as sleep } from 'node:timers/promises'
import { useState } from 'react'
import { data, useNavigate } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { z } from 'zod'
import { users } from '../_shared/data/users'
import type { Route } from './+types/route'
import { UsersDeleteDialog } from './components/users-delete-dialog'

export const formSchema = z.object({
  email: z
    .string({ required_error: 'Email is required.' })
    .email({ message: 'Email is invalid.' }),
  role: z.string({ required_error: 'Role is required.' }),
  desc: z.string().optional(),
})

export const loader = ({ params }: Route.LoaderArgs) => {
  const user = users.find((user) => user.id === params.user)
  if (!user) {
    throw data(null, { status: 404 })
  }
  return { user }
}

export const action = async ({ params }: Route.ActionArgs) => {
  const user = users.find((user) => user.id === params.user)
  if (!user) {
    throw data(null, { status: 404 })
  }

  await sleep(1000)
  // remove the user from the list
  users.splice(
    users.findIndex((u) => u.id === user.id),
    1,
  )

  return redirectWithSuccess('/users', {
    message: 'User deleted successfully!',
    description: `The user ${user.email} has been removed.`,
  })
}

export default function UserDelete({
  loaderData: { user },
}: Route.ComponentProps) {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  return (
    <UsersDeleteDialog
      key={`user-delete-${user.id}`}
      user={user}
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(false)
          // wait for the drawer to close
          setTimeout(() => {
            navigate('/users')
          }, 300) // the duration of the modal close animation
        }
      }}
    />
  )
}
