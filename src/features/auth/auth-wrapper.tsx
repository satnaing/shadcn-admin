import { ReactNode, useState } from 'react'
import { useLayoutEffect, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth.store'

interface AuthWrapperProps {
  children: ReactNode
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const isSignedIn = useAuthStore((state) => state?.session?.user?.id)
  const [shouldRender, setShouldRender] = useState(false)
  const navigate = useNavigate()

  useLayoutEffect(() => {
    if (isSignedIn) {
      navigate({ to: '/' })
    } else {
      setShouldRender(true)
    }
  }, [isSignedIn])

  if (!shouldRender) return <></>

  return <>{children}</>
}

export default AuthWrapper
