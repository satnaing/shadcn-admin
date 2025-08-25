import { useEffect, useRef, useState } from 'react'
import { useUser, useAuth } from '@clerk/clerk-react'
import { toast } from 'sonner'
import { useUserLoginMutation, useSubscriptionLazyQuery } from '@/graphql/operations/operations.generated'

interface UseClerkAuthOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useClerkAuth(options?: UseClerkAuthOptions) {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const [hasLoggedIn, setHasLoggedIn] = useState(false)
  const loginAttempted = useRef(false)
  
  const [getSubscription] = useSubscriptionLazyQuery()

  const [userLogin] = useUserLoginMutation({
    onCompleted: async (data) => {
      if (data?.userLogin) {
        // Set a cookie to track that user has logged in
        document.cookie = 'swan.known=true; domain=.getswan.com; path=/; Secure; SameSite=None'
        
        // Fetch subscription data
        await getSubscription({ 
          fetchPolicy: 'network-only' 
        })
        
        // Handle onboarding status if needed
        // const onboardingStatus = data.userLogin.onboardingStatus
        // TODO: Add onboarding flow if needed based on onboardingStatus and subscription
        // Example logic from agents app:
        // if (onboardingStatus && onboardingStatus !== 'COMPLETED') {
        //   router.navigate({ to: '/onboarding' })
        // } else if (subscriptionData?.subscription?.status === 'TRIAL') {
        //   // Handle trial users
        // }
        
        setHasLoggedIn(true)
        options?.onSuccess?.()
      }
    },
    onError: (error) => {
      toast.error(
        error.message.toLowerCase().includes('personal email')
          ? 'Use your work email to login'
          : 'There was an error logging in',
        {
          description: error.message,
        }
      )
      options?.onError?.(error)
    },
  })

  useEffect(() => {
    // Only run if Clerk has loaded, user is signed in, and we haven't already logged in
    if (!isLoaded || !isSignedIn || !user || hasLoggedIn || loginAttempted.current) {
      return
    }

    loginAttempted.current = true

    userLogin()
  }, [isLoaded, isSignedIn, user, hasLoggedIn, userLogin])

  return {
    isAuthenticated: hasLoggedIn,
    isLoading: !isLoaded || (isSignedIn && !hasLoggedIn),
  }
}
