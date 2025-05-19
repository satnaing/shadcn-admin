import { createFileRoute } from '@tanstack/react-router'
import { SignedIn, UserButton } from '@clerk/clerk-react'

export const Route = createFileRoute('/clerk/user-management')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <SignedIn>
      <UserButton />
    </SignedIn>
  )
}
