"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  verifyEmail: (code: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true)
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simulate successful login
        setUser({
          id: "1",
          email,
          name: "John Doe",
        })

        toast.success("Login successful")
        navigate({ to: "/onboarding/extension" })
      } catch (error) {
        toast.error("Login failed. Please check your credentials.")
      } finally {
        setIsLoading(false)
      }
    },
    [navigate],
  )

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      setIsLoading(true)
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast.success("Registration successful")
        navigate({ to: "/onboarding/extension" })
      } catch (error) {
        toast.error("Registration failed. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [navigate],
  )

  const logout = useCallback(() => {
    setUser(null)
    navigate({ to: "/sign-in" })
    toast.success("Logged out successfully")
  }, [navigate])

  const verifyEmail = useCallback(
    async (code: string) => {
      setIsLoading(true)
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast.success("Email verified successfully")
        navigate({ to: "/onboarding/extension" })
      } catch (error) {
        toast.error("Verification failed. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [navigate],
  )

  const forgotPassword = useCallback(
    async (email: string) => {
      setIsLoading(true)
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast.success("Password reset link sent to your email")
        navigate({ to: "/auth/login" })
      } catch (error) {
        toast.error("Failed to send reset link. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [navigate],
  )

  const resetPassword = useCallback(
    async (token: string, password: string) => {
      setIsLoading(true)
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast.success("Password reset successful")
        navigate({ to: "/sign-in" })
      } catch (error) {
        toast.error("Failed to reset password. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [navigate],
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
