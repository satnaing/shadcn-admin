"use client"

import { useNavigate, useLocation } from "@tanstack/react-router"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/context/onboarding-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const STEPS = [
  { path: "/onboarding/extension", label: "Extension" },
  { path: "/onboarding/linkedin", label: "LinkedIn" },
  { path: "/onboarding/post-settings", label: "Post Settings" },
  { path: "/onboarding/comment-settings", label: "Comment Settings" },
  { path: "/onboarding/other-settings", label: "Other Settings" },
]

const STAGE_MESSAGES = [
  "Just few steps to automate your LinkedIn",
  "Great! Now let's connect your LinkedIn account",
  "Almost there! Configure your post preferences",
  "Few steps are remaining for complete setup",
  "Last 2 steps to complete your automation setup",
]

export function OnboardingProgress() {
  const navigate = useNavigate()
  const location = useLocation()
  const { completedSteps } = useOnboarding()

  const pathname = location.pathname
  const currentStepIndex = STEPS.findIndex((step) => pathname.includes(step.path))
  const progress = currentStepIndex >= 0 ? (currentStepIndex / (STEPS.length - 1)) * 100 : 0

  const currentMessage =
    currentStepIndex >= 0 && currentStepIndex < STAGE_MESSAGES.length
      ? STAGE_MESSAGES[currentStepIndex]
      : "Complete your LinkedIn automation setup"

  const handleStepClick = (stepPath: string, index: number) => {
    const stepName = stepPath.split("/").pop() || ""
    if (completedSteps.includes(stepName) || index <= currentStepIndex + 1) {
      navigate({ to: stepPath })
    }
  }

  return (
    <div className="space-y-10 mb-20">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-clash text-foreground">Your Setup Progress</h2>
          <p className="text-sm text-muted-foreground">{currentMessage}</p>
        </div>
        <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
          {Math.round(progress)}% Complete
        </span>
      </div>

      <div className="relative mt-8 px-5">
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              backgroundImage:
                "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite",
            }}
          />
        </div>

        <div className="absolute top-1 left-0 right-0 flex justify-between -translate-y-1/2">
          {STEPS.map((step, index) => {
            const stepName = step.path.split("/").pop() || ""
            const isActive = index === currentStepIndex
            const isCompleted = index < currentStepIndex || completedSteps.includes(stepName)
            const isClickable = isCompleted || index <= currentStepIndex + 1

            return (
              <TooltipProvider key={step.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex flex-col items-center z-10 relative",
                        isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                      )}
                      onClick={() => handleStepClick(step.path, index)}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 border-2 bg-card",
                          isActive && "bg-primary border-primary text-primary-foreground shadow-sm",
                          isCompleted && "bg-primary border-primary text-primary-foreground shadow-sm",
                          !isActive && !isCompleted && "bg-muted border-border text-muted-foreground",
                        )}
                      >
                        {isCompleted ? (
                          <CheckIcon className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{index + 1}</span>
                        )}
                      </div>

                      <span
                        className={cn(
                          "absolute top-12 text-xs font-medium text-center whitespace-nowrap hidden md:block",
                          isActive && "text-primary",
                          isCompleted && "text-primary",
                          !isActive && !isCompleted && "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isClickable ? `Go to ${step.label}` : "Complete previous steps first"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>
      </div>
    </div>
  )
}
