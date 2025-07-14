import type { ReactNode } from 'react'
import { useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { OnboardingProvider } from '@/context/onboarding-context'
import { OnboardingHeader } from './onboarding-header'
import { OnboardingProgress } from './onboarding-progress'

interface OnboardingLayoutProps {
  children: ReactNode
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const location = useLocation()
  const isDemoStep = location.pathname === '/onboarding/demo'

  return (
    <OnboardingProvider>
      <div className='flex min-h-screen flex-col'>
        <OnboardingHeader />
        <div className='flex flex-1 flex-col lg:flex-row'>
          <main
            className={cn(
              'flex-1 px-4 py-8 md:px-8',
              isDemoStep ? 'container max-w-6xl' : 'container max-w-4xl'
            )}
          >
            {!isDemoStep ? (
              <>
                <OnboardingProgress />
                <div className='mt-8'>{children}</div>
              </>
            ) : (
              <div>{children}</div>
            )}
          </main>
        </div>
      </div>
    </OnboardingProvider>
  )
}
