"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Eye, EyeOff, Github, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "./auth-layout"
import { ThemeSwitch } from "@/components/theme-switch"
import { useAuth } from "@/context/auth-context"

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <AuthLayout>
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2 text-left">
          <h1 className="text-2xl font-bold tracking-tight">Login</h1>
          <p className="text-sm text-muted-foreground">Enter your email and password below to log into your account</p>
        </div>
        <div className="lg:hidden">
          <ThemeSwitch />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full h-11 bg-gradient-to-r from-primary to-blue-400" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" type="button" disabled={isLoading} className="h-11">
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" type="button" disabled={isLoading} className="h-11">
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 1.8c4.528 0 8.2 3.672 8.2 8.2 0 4.528-3.672 8.2-8.2 8.2-4.528 0-8.2-3.672-8.2-8.2 0-4.528 3.672-8.2 8.2-8.2zM10 17l6-5-6-5v10z" />
          </svg>
          Google
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/auth/register" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        By clicking login, you agree to our{" "}
        <Link to="/terms" className="hover:text-primary underline underline-offset-4">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="hover:text-primary underline underline-offset-4">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthLayout>
  )
}
