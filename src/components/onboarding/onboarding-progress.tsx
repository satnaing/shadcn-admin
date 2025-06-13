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
  { path: "/onboarding/demo", label: "Demo" },
]

export function OnboardingProgress() {
  const navigate = useNavigate()
  const location = useLocation()
  const { completedSteps } = useOnboarding()

  const pathname = location.pathname
  const currentStepIndex = STEPS.findIndex((step) => pathname.includes(step.path))
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  const handleStepClick = (stepPath: string, index: number) => {
    // Allow navigation to completed steps or the current step + 1
    const stepName = stepPath.split("/").pop() || ""
    if (completedSteps.includes(stepName) || index <= currentStepIndex + 1) {
      navigate({ to: stepPath })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Setup Progress</h2>
        <span className="text-sm font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">
          {Math.round(progress)}% Complete
        </span>
      </div>

      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
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

      <div className="relative flex justify-between mt-8">
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
                      "flex flex-col items-center z-10",
                      isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                    )}
                    onClick={() => handleStepClick(step.path, index)}
                  >
                    <div
                      className={cn(
                        "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                        isActive && "bg-primary text-primary-foreground shadow-sm",
                        isCompleted && "bg-green-500 text-white shadow-sm",
                        !isActive && !isCompleted && "bg-secondary text-secondary-foreground",
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
                        "mt-2 text-xs font-medium hidden md:block",
                        isActive && "text-primary dark:text-primary-400",
                        isCompleted && "text-green-600 dark:text-green-400",
                        !isActive && !isCompleted && "text-muted-foreground",
                      )}
                    >
                      {step.label}
                    </span>

                    {index < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "absolute top-5 h-0.5 bg-secondary transition-all duration-300",
                          (isActive || isCompleted) && "bg-primary",
                          "left-[calc(50%+20px)] right-[calc(50%-20px)] -z-10",
                        )}
                      />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{isClickable ? `Go to ${step.label}` : "Complete previous steps first"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        })}
      </div>
    </div>
  )
}
