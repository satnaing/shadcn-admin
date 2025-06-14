import type { ReactNode } from "react"
import { OnboardingHeader } from "./onboarding-header"
import { OnboardingProgress } from "./onboarding-progress"
import { OnboardingTestimonials } from "./onboarding-testimonials"
import { OnboardingProvider } from "@/context/onboarding-context"

interface OnboardingLayoutProps {
  children: ReactNode
}

export function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <OnboardingProvider>
      <div className="min-h-screen flex flex-col">
        <OnboardingHeader />
        <div className="flex-1 flex flex-col lg:flex-row">
          <main className="flex-1 container max-w-4xl py-8 px-4 md:px-8">
            <OnboardingProgress />
            <div className="mt-8">{children}</div>
          </main>
          <OnboardingTestimonials />
        </div>
      </div>
    </OnboardingProvider>
  )
}
