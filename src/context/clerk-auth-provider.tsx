import type { ReactNode } from 'react'
import { useClerkAuth } from '@/hooks/use-clerk-auth'
import { Loader2 } from 'lucide-react'

interface ClerkAuthProviderProps {
  children: ReactNode
}

export function ClerkAuthProvider({ children }: ClerkAuthProviderProps) {
  const { isLoading } = useClerkAuth()

  // Show loading state while backend login is in progress
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
