import { useCallback, useEffect, useState } from 'react'

type ToastType = 'default' | 'destructive' | 'success'

interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: ToastType
}

interface ToastProps {
  title?: string
  description?: string
  variant?: ToastType
  action?: React.ReactNode
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((props: ToastProps) => {
    const id = String(toastCount++)
    const newToast: Toast = {
      id,
      variant: 'default',
      ...props,
    }
    
    setToasts((prev) => [...prev, newToast])
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
    
    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}
