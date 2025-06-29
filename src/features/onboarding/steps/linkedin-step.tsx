"use client"

import { useState, useEffect } from "react"
import { Linkedin, CheckCircle2, Info, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { OnboardingCard } from "@/features/onboarding/onboarding-card"
import { OnboardingNavigation } from "@/features/onboarding/onboarding-navigation"
import { useOnboarding } from "@/context/onboarding-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { envConfig } from "@/config/env.config"
import { checkIsExtensionInstalled, getProfileDetailsFromExtension } from "@/lib/utils"
import { useGetAllProfileQuery, useLinkProfile } from "@/features/linkedin-profile/query/profile.query"
import { IProfile } from "@/features/linkedin-profile/interface/profile.interface"

export function LinkedInStep() {
  const { data: onboardingData, updateData, markStepCompleted } = useOnboarding()
  const { data: profiles, isLoading } = useGetAllProfileQuery()
  const { linkProfile, isLinkingProfile } = useLinkProfile()
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false)
  const [isLinking, setIsLinking] = useState(false)

  const checkIfExtensionIsInstalled = async () => {
    const isInstalled = await checkIsExtensionInstalled(
      envConfig.chromeExtensionId,
      envConfig.chromeExtensionIconUrl
    )
    setIsExtensionInstalled(isInstalled)
  }

  const handleLinking = async () => {
    setIsLinking(true)
    try {
      const profileDetails = await getProfileDetailsFromExtension()
      await linkProfile(profileDetails)
      
      // Update onboarding context with the first profile
      if (profiles?.length) {
        updateData({
          isLinkedInConnected: true,
          userProfile: {
            name: `${profiles[0].firstName} ${profiles[0].lastName}`,
            title: profiles[0].about || "LinkedIn Member", // Using 'about' instead of 'headline'
            avatar: "/placeholder.svg", // Default avatar since profilePicture isn't in IProfile
          },
        })
        markStepCompleted("linkedin")
      }
    } catch (error) {
      console.error("Error linking profile:", error)
    } finally {
      setIsLinking(false)
    }
  }

  useEffect(() => {
    checkIfExtensionIsInstalled()
  }, [])

  // Mark step as completed if we have profiles
  useEffect(() => {
    if (profiles?.length) {
      markStepCompleted("linkedin")
      updateData({
        isLinkedInConnected: true,
        userProfile: {
          name: `${profiles[0].firstName} ${profiles[0].lastName}`,
          title: profiles[0].about || "LinkedIn Member",
          avatar: "/placeholder.svg",
        },
      })
    }
  }, [profiles, markStepCompleted, updateData])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <OnboardingCard
          title="Connecting to LinkedIn"
          description="Fetching your LinkedIn profile information..."
        >
          <div className="flex flex-col items-center space-y-6 py-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading your profile...</span>
            </div>
          </div>
        </OnboardingCard>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <OnboardingCard
        title={
          <div className="flex items-center gap-2">
            Connect Your LinkedIn Account
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>We use LinkedIn's secure API to access only<br/>the data needed for automated commenting</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
        description="We need access to your LinkedIn account to automate comments on your behalf."
      >
        <div className="flex flex-col items-center space-y-6 py-4">
          {profiles?.length ? (
            <div className="flex flex-col items-center space-y-4 w-full max-w-md">
              <div className="flex items-center gap-2 text-green-500 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">LinkedIn connected successfully!</span>
              </div>

              <div className="flex flex-col gap-4 p-4 border rounded-lg w-full">
                {profiles.map((profile: IProfile) => (
                  <div key={profile._id} className="flex items-center gap-4 p-3 border rounded">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-muted-foreground">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{profile.firstName} {profile.lastName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.about || "LinkedIn Member"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{profile.publicIdentifier}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6 w-full max-w-md">
              <div className="relative w-full max-w-md h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="https://res.cloudinary.com/djpcpmrjd/image/upload/v1749773556/uploads/file-1749773555007-74175948-linkedin.jpg.jpg"
                  alt="LinkedIn Screenshot"
                  className="object-cover w-full h-full"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help bg-background">
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p>Your LinkedIn profile information will be used<br/>to personalize generated comments</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {isExtensionInstalled ? (
                <Button
                  className="w-full relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95"
                  onClick={handleLinking}
                  disabled={isLinking || isLinkingProfile}
                >
                  <Linkedin className="mr-2 h-4 w-4" />
                  {isLinking || isLinkingProfile ? "Connecting..." : "Connect LinkedIn"}
                </Button>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Please install our <a href={envConfig.extensionUrl} className="text-primary underline" target="_blank">Chrome extension</a> first</p>
                </div>
              )}
            </div>
          )}
        </div>

        {profiles?.length && <OnboardingNavigation nextStep="/onboarding/post-settings" />}
      </OnboardingCard>
    </div>
  )
}