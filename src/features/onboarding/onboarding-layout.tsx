import type { ReactNode } from "react"
import { OnboardingHeader } from "./onboarding-header"
import { OnboardingProgress } from "./onboarding-progress"
import { OnboardingProvider } from "@/context/onboarding-context"
import { useLocation } from "@tanstack/react-router"
import { cn } from "@/lib/utils"

interface OnboardingLayoutProps {
  children: ReactNode
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const location = useLocation()
  const isDemoStep = location.pathname === "/onboarding/demo"

  return (
    <OnboardingProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/30 to-muted/50">
        <OnboardingHeader />
        <div className="flex-1 flex flex-col lg:flex-row">
          <main className={cn("flex-1 py-8 px-4 md:px-8", isDemoStep ? "container max-w-6xl" : "container max-w-4xl")}>
            {!isDemoStep ? (
              <>
                <OnboardingProgress />
                <div className="mt-8">{children}</div>
              </>
            ) : (
              <div>{children}</div>
            )}
          </main>
        </div>
      </div>
    </OnboardingProvider>
  )
}
