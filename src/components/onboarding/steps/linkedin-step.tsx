"use client"

import { useState, useEffect } from "react"
import { Linkedin, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation"
import { useOnboarding } from "@/context/onboarding-context"

export function LinkedInStep() {
  const { data, updateData, markStepCompleted } = useOnboarding()
  const [connecting, setConnecting] = useState(false)

  // Use stored values from context
  const isConnected = data.isLinkedInConnected
  const userProfile = data.userProfile

  const connectLinkedIn = async () => {
    setConnecting(true)

    // Mock LinkedIn connection - in a real app, you'd use OAuth
    setTimeout(() => {
      updateData({
        isLinkedInConnected: true,
        userProfile: {
          name: "Alex Johnson",
          title: "Senior Marketing Manager",
          avatar: "/placeholder.svg?height=100&width=100",
        },
      })
      setConnecting(false)
      markStepCompleted("linkedin")
    }, 2000)
  }

  // Mark step as visited when component mounts
  useEffect(() => {
    if (isConnected) {
      markStepCompleted("linkedin")
    }
  }, [isConnected, markStepCompleted])

  return (
    <div className="space-y-8">
      <OnboardingCard
        title="Connect Your LinkedIn Account"
        description="We need access to your LinkedIn account to automate comments on your behalf."
      >
        <div className="flex flex-col items-center space-y-6 py-4">
          {isConnected && userProfile ? (
            <div className="flex flex-col items-center space-y-4 w-full max-w-md">
              <div className="flex items-center gap-2 text-green-500 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">LinkedIn connected successfully!</span>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg w-full">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-muted-foreground">{userProfile.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-medium">{userProfile.name}</h3>
                  <p className="text-sm text-muted-foreground">{userProfile.title}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 w-full max-w-md">
             <div className="relative w-full max-w-md h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
  <img
    src="https://res.cloudinary.com/djpcpmrjd/image/upload/v1749773556/uploads/file-1749773555007-74175948-linkedin.jpg.jpg"
    alt="Linkedin Screenshot"
    className="object-cover w-full h-full"
  />
</div>


              <Button
                className="w-full relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95"
                onClick={connectLinkedIn}
                disabled={connecting}
              >
                <Linkedin className="mr-2 h-4 w-4" />
                {connecting ? "Connecting..." : "Connect LinkedIn"}
              </Button>
            </div>
          )}
        </div>
      </OnboardingCard>

      <OnboardingNavigation
        prevStep="/onboarding/extension"
        nextStep="/onboarding/post-settings"
        nextLabel={isConnected ? "Continue" : "Skip for now"}
      />
    </div>
  )
}
