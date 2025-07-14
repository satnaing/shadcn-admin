// src/components/profile-form.tsx
'use client'

import { useProfile } from '@/context/profile.context'
import { useGetAllProfileQuery } from '@/features/users/query/profile.query'

// src/components/profile-form.tsx

export function ProfileForm() {
  const { data: profiles, isLoading } = useGetAllProfileQuery()
  const { activeProfile } = useProfile()

  if (isLoading) {
    return (
      <div className='flex items-center gap-3 rounded-lg border p-4'>
        <div className='h-10 w-10 animate-pulse rounded-full bg-gray-200'></div>
        <div className='space-y-2'>
          <div className='h-4 w-32 animate-pulse rounded bg-gray-200'></div>
          <div className='h-3 w-24 animate-pulse rounded bg-gray-200'></div>
        </div>
      </div>
    )
  }

  if (!profiles || profiles.length === 0 || !activeProfile) {
    return (
      <div className='text-muted-foreground rounded-lg border p-4 text-center text-sm'>
        No profile connected
      </div>
    )
  }

  return (
    <div className='flex items-center gap-3 rounded-lg border p-4'>
      <div className='bg-primary text-primary-foreground flex aspect-square h-10 w-10 items-center justify-center rounded-full'>
        <span className='text-sm font-bold'>
          {activeProfile.firstName.charAt(0)}
          {activeProfile.lastName.charAt(0)}
        </span>
      </div>
      <div className='grid flex-1 text-left'>
        <span className='font-semibold'>
          {activeProfile.firstName} {activeProfile.lastName}
        </span>
        <span className='text-muted-foreground text-sm'>
          @{activeProfile.publicIdentifier}
        </span>
      </div>
    </div>
  )
}
