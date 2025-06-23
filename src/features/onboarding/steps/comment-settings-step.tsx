"use client"

import { useState } from "react"
import { MessageSquare, Settings } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OnboardingCard } from "../onboarding-card"
import { OnboardingNavigation } from "../onboarding-navigation"

export function CommentSettingsStep() {
  const [aboutProfile, setAboutProfile] = useState("")
  const [commentStyle, setCommentStyle] = useState("balanced")

  return (
    <OnboardingCard
      title="Comment Generation Settings"
      description="Configure how your automated comments will be generated and styled."
    >
      <div className="mb-8 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="about-profile" className="text-foreground font-medium">
              About Your Profile
            </Label>
          </div>
          <Textarea
            id="about-profile"
            value={aboutProfile}
            onChange={(e) => setAboutProfile(e.target.value)}
            placeholder="Describe your professional background, expertise, and interests to help generate relevant comments"
            className="min-h-[120px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-card border-border text-card-foreground"
          />
          <span className="text-xs text-muted-foreground">This helps our AI understand your voice and expertise</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <Label className="text-foreground font-medium">Comment Size</Label>
          </div>
          <Select value={commentStyle} onValueChange={setCommentStyle}>
            <SelectTrigger className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-card border-border text-card-foreground">
              <SelectValue placeholder="Select comment style" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="balanced">Short (10 words)</SelectItem>
              <SelectItem value="casual">Medium (15 words)</SelectItem>
              <SelectItem value="enthusiastic">Large (25 words)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <OnboardingNavigation nextStep="/onboarding/other-settings" />
    </OnboardingCard>
  )
}
