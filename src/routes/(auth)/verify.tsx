"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "./auth-layout"
import { useAuth } from "@/context/auth-context"

export default function VerifyPage() {
  const { verifyEmail, isLoading } = useAuth()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) {
        prevInput.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length !== 6) {
      return
    }

    await verifyEmail(otpValue)
  }

  const handleResend = async () => {
    if (!canResend) return

    setCanResend(false)
    setResendTimer(60)

    // Mock resend - replace with actual resend
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <AuthLayout>
      <div className="flex flex-col space-y-2 text-left">
        <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
        <p className="text-sm text-muted-foreground">We've sent a verification code to your email address</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter verification code</label>
          <div className="flex gap-2 justify-between">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-12 text-center text-lg"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
                autoFocus={index === 0}
              />
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-blue-400" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive a code?{" "}
            <button
              type="button"
              className={`text-primary ${canResend ? "hover:underline" : "opacity-50 cursor-not-allowed"}`}
              onClick={handleResend}
              disabled={!canResend}
            >
              {canResend ? "Resend code" : `Resend in ${resendTimer}s`}
            </button>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
