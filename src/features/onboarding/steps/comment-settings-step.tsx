"use client"

import { useEffect } from "react"
import { MessageSquare, Smile, AlertTriangle, Settings } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { OnboardingCard } from "@/features/onboarding/onboarding-card"
import { OnboardingNavigation } from "@/features/onboarding/onboarding-navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboarding } from "@/context/onboarding-context"

export function CommentSettingsStep() {
  const { data, updateData, markStepCompleted } = useOnboarding()

  // Use stored values from context
  const aboutProfile = data.aboutProfile
  const additionalRules = data.additionalRules
  const useEmojis = data.useEmojis
  const useExclamations = data.useExclamations
  const commentStyle = data.commentStyle

  // Mark step as visited when component mounts or when form is filled
  useEffect(() => {
    const isFormFilled =
      aboutProfile !== "" ||
      additionalRules !== "" ||
      useEmojis !== true ||
      useExclamations !== true ||
      commentStyle !== "balanced"
    if (isFormFilled) {
      markStepCompleted("comment-settings")
    }
  }, [aboutProfile, additionalRules, useEmojis, useExclamations, commentStyle, markStepCompleted])

  return (
    <div className="space-y-8">
      <OnboardingCard
        title="Comment Generation Settings"
        description="Configure how your automated comments will be generated and styled."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="about-profile">About Your Profile</Label>
            </div>
            <Textarea
              id="about-profile"
              value={aboutProfile}
              onChange={(e) => updateData({ aboutProfile: e.target.value })}
              placeholder="Describe your professional background, expertise, and interests to help generate relevant comments"
              className="min-h-[120px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            <span className="text-xs text-muted-foreground">This helps our AI understand your voice and expertise</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="additional-rules">Additional Rules</Label>
            </div>
            <Textarea
              id="additional-rules"
              value={additionalRules}
              onChange={(e) => updateData({ additionalRules: e.target.value })}
              placeholder="Add any specific rules or guidelines for comment generation (e.g., 'Always mention my experience in marketing', 'Never use certain phrases')"
              className="min-h-[120px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <Label>Comment Style</Label>
            </div>
            <Select value={commentStyle} onValueChange={(value) => updateData({ commentStyle: value })}>
              <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <SelectValue placeholder="Select comment style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional & Formal</SelectItem>
                <SelectItem value="balanced">Balanced (Recommended)</SelectItem>
                <SelectItem value="casual">Casual & Conversational</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smile className="h-4 w-4 text-muted-foreground" />
              <Label>Style Preferences</Label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emojis" className="text-sm">
                    Use Emojis
                  </Label>
                  <p className="text-xs text-muted-foreground">Include relevant emojis in comments</p>
                </div>
                <Switch
                  id="emojis"
                  checked={useEmojis}
                  onCheckedChange={(checked) => updateData({ useEmojis: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="exclamations" className="text-sm">
                    Use Exclamations
                  </Label>
                  <p className="text-xs text-muted-foreground">Add emphasis with exclamation points</p>
                </div>
                <Switch
                  id="exclamations"
                  checked={useExclamations}
                  onCheckedChange={(checked) => updateData({ useExclamations: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </OnboardingCard>

      <OnboardingNavigation
        prevStep="/onboarding/post-settings"
        nextStep="/onboarding/demo"
        onNext={() => {
          markStepCompleted("comment-settings")
          return true
        }}
      />
    </div>
  )
}
