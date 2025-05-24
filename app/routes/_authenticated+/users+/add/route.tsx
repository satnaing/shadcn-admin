import { parseWithZod } from '@conform-to/zod'
import { setTimeout as sleep } from 'node:timers/promises'
import { useState } from 'react'
import { href } from 'react-router'
import { redirectWithSuccess } from 'remix-toast'
import { useSmartNavigation } from '~/hooks/use-smart-navigation'
import {
  UsersActionDialog,
  createSchema as formSchema,
} from '../_shared/components/users-action-dialog'
import { users } from '../_shared/data/users'
import type { Route } from './+types/route'

export const action = async ({ request }: Route.ActionArgs) => {
  const url = new URL(request.url)
  const submission = parseWithZod(await request.formData(), {
    schema: formSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  // Create a new task
  await sleep(1000)
  const newUser = {
    ...submission.value,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: crypto.randomUUID(),
    status: 'active',
  } as const
  users.unshift(newUser)

  return redirectWithSuccess(`/users?${url.searchParams.toString()}`, {
    message: 'User added successfully',
    description: JSON.stringify(newUser),
  })
}

export default function UserAdd() {
  const [open, setOpen] = useState(true)
  const { goBack } = useSmartNavigation({
    baseUrl: href('/users'),
  })

  return (
    <UsersActionDialog
      key="user-add"
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(false)
          console.log('UserAdd dialog closed')
          // wait for the modal to close
          setTimeout(() => {
            console.log('Navigating back to users list')
            goBack()
          }, 300) // the duration of the modal close animation
        }
      }}
    />
  )
}
