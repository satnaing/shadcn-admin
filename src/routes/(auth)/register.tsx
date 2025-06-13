"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Eye, EyeOff, Github, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "./auth-layout"
import { useAuth } from "@/context/auth-context"

export default function RegisterPage() {
  const { register, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register(email, password, name)
  }

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Enter your email to create your Commentify account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-400" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
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
        <Button variant="outline" type="button" disabled={isLoading}>
          <Github className="mr-2 h-4 w-4" />
          GitHub
        </Button>
        <Button variant="outline" type="button" disabled={isLoading}>
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm0 1.8c4.528 0 8.2 3.672 8.2 8.2 0 4.528-3.672 8.2-8.2 8.2-4.528 0-8.2-3.672-8.2-8.2 0-4.528 3.672-8.2 8.2-8.2zM10 17l6-5-6-5v10z" />
          </svg>
          Google
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-primary hover:underline">
          Log in
        </Link>
      </p>

      <p className="text-center text-xs text-muted-foreground">
        By clicking create account, you agree to our{" "}
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
