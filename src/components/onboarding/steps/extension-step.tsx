"use client"

import { useState, useEffect } from "react"
import { Download, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { OnboardingNavigation } from "@/components/onboarding/onboarding-navigation"
import { useOnboarding } from "@/context/onboarding-context"

export function ExtensionStep() {
  const { data, updateData, markStepCompleted } = useOnboarding()
  const [checking, setChecking] = useState(false)

  // Use the stored value from context
  const isInstalled = data.isExtensionInstalled

  const checkExtension = async () => {
    setChecking(true)

    // Mock extension check - in a real app, you'd use chrome.runtime.sendMessage
    // or a similar method to check if the extension is installed
    setTimeout(() => {
      updateData({ isExtensionInstalled: true })
      setChecking(false)
      markStepCompleted("extension")
    }, 1500)
  }

  // Mark step as visited when component mounts
  useEffect(() => {
    if (isInstalled) {
      markStepCompleted("extension")
    }
  }, [isInstalled, markStepCompleted])

  return (
    <div className="space-y-8">
      <OnboardingCard
        title="Install the Chrome Extension"
        description="To automate LinkedIn comments, you need to install our Chrome extension."
      >
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="relative w-full max-w-md h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
  <img
    src="https://lh3.googleusercontent.com/gciAyVtg2Y35HfarPfKkfESnxN04F59r885B-_UNpk5NSd-e_BFLLaFD1jihwhiHr0nDdYmup5YlGhxFi1TTrMpWww"
    alt="Extension Screenshot"
    className="object-cover w-full h-full"
  />
</div>


          {isInstalled ? (
            <div className="flex items-center gap-2 text-green-500 dark:text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Extension installed successfully!</span>
            </div>
          ) : (
            <div className="space-y-4 w-full max-w-xs">
              <Button
                className="w-full relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95"
                onClick={() => window.open("https://chrome.google.com/webstore", "_blank")}
              >
                <Download className="mr-2 h-4 w-4" />
                Install Extension
              </Button>
              <Button
                variant="outline"
                className="w-full relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95"
                onClick={checkExtension}
                disabled={checking}
              >
                {checking ? "Checking..." : "I've installed the extension"}
              </Button>
            </div>
          )}
        </div>
      </OnboardingCard>

      <OnboardingNavigation nextStep="/onboarding/linkedin" nextLabel={isInstalled ? "Continue" : "Skip for now"} />
    </div>
  )
}
