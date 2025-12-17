import { createContext, useEffect } from 'react'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { useIdle } from '@/hooks/use-idle'

const LockScreenContext = createContext<boolean | null>(null)

type LockScreenProviderProps = {
  children: React.ReactNode
}

export function LockScreenProvider({ children }: LockScreenProviderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  // 30 minutes = 30 * 60 * 1000 ms
  const idle = useIdle(30 * 60 * 1000)

  // For more Secrity We Can Add A a Locked Value To LocalStorage so we can prevent the user from accessing others pages if he is locked
  // Maybe Add it in the Future ?

  useEffect(() => {
    if (idle && location.pathname !== '/lock-screen') {
      toast.warning('Locked due to inactivity!', { position: 'top-center' })
      navigate({ to: '/lock-screen' })
    }
  }, [idle, location.pathname, navigate])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        navigate({ to: '/lock-screen' })
      }
    }
    window.addEventListener('keydown', down, true)
    return () => window.removeEventListener('keydown', down, true)
  }, [navigate])

  return (
    <LockScreenContext.Provider value={true}>
      {children}
    </LockScreenContext.Provider>
  )
}
