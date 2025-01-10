import { useAuthStore } from '@/stores/authStore'
import { redirect } from '@tanstack/react-router'

export function authMiddleware() {
  const authStore = useAuthStore.getState()
  
  // If we have a token but no user, initialize synchronously
  if (authStore.accessToken && !authStore.user) {
    authStore.initializeFromCookieSync()
  }
  
  if (!authStore.user) {
    throw redirect({
      to: '/sign-in',
      search: {
        redirect: window.location.pathname
      }
    })
  }
}

export function guestMiddleware() {
  const authStore = useAuthStore.getState()
  
  // If we have a token but no user, initialize synchronously
  if (authStore.accessToken && !authStore.user) {
    authStore.initializeFromCookieSync()
  }
  
  if (authStore.user) {
    throw redirect({
      to: '/'
    })
  }
} 