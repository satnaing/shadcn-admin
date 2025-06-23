"use client"

import { useNavigate } from "@tanstack/react-router"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OnboardingNavigationProps {
  prevStep?: string
  nextStep?: string
  nextLabel?: string
  onNext?: () => Promise<boolean> | boolean
  loading?: boolean
}

export function OnboardingNavigation({
  prevStep,
  nextStep,
  nextLabel = "Continue",
  onNext,
  loading = false,
}: OnboardingNavigationProps) {
  const navigate = useNavigate()

  const handleNext = async () => {
    if (onNext) {
      const canProceed = await onNext()
      if (!canProceed) return
    }

    if (nextStep) {
      navigate({ to: nextStep })
    }
  }

  return (
    <div className="flex justify-between mt-8">
      {prevStep ? (
        <Button
          variant="outline"
          onClick={() => navigate({ to: prevStep })}
          disabled={loading}
          className="group relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95 bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </Button>
      ) : (
        <div></div>
      )}

      {nextStep && (
        <Button
          onClick={handleNext}
          disabled={loading}
          className="group relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              {nextLabel}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}
