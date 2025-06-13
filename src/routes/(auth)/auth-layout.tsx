import type { ReactNode } from "react"
import { MessageSquare } from "lucide-react"
import { AuthProvider } from "@/context/auth-context"

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthProvider>
      <div className="relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <MessageSquare className="mr-2 h-6 w-6" />
            Commentify
          </div>

          <div className="relative z-20 flex items-center justify-center flex-1">
            <div className="w-[300px] h-[300px] relative animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-yellow-400 to-purple-500 rounded-lg transform rotate-12"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <MessageSquare className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>

          <div className="relative z-20 mt-auto">
            <div className="space-y-2">
              <p className="text-lg">
                &ldquo;The AI-generated comments are thoughtful and have significantly increased my network
                growth.&rdquo;
              </p>
              <footer className="text-sm">Michael Chen, Marketing Director</footer>
            </div>
          </div>
        </div>

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">{children}</div>
        </div>
      </div>
    </AuthProvider>
  )
}
