"use client"

import { useState } from "react"
import { MessageSquare, Settings, Smile, Calendar, ChevronDown, ChevronUp, Info } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { OnboardingCard } from "../onboarding-card"
import { OnboardingNavigation } from "../onboarding-navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function CommentSettingsStep() {
  const [aboutProfile, setAboutProfile] = useState("")
  const [commentStyle, setCommentStyle] = useState("balanced")
  const [commentsPerDay, setCommentsPerDay] = useState(10)
  const [isStylePreferencesExpanded, setIsStylePreferencesExpanded] = useState(false)
  const [isCommentSettingsExpanded, setIsCommentSettingsExpanded] = useState(false)
  const [useEmojis, setUseEmojis] = useState(true)
  const [useExclamations, setUseExclamations] = useState(true)

  return (
    <OnboardingCard
      title="Comment Generation Settings"
      description="Configure how your automated comments will be generated and styled."
    >
      <div className="mb-8 space-y-6">
        {/* About Profile Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="about-profile" className="text-foreground font-medium">
              About Your Profile
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>Describe your background to help generate<br/>comments that match your expertise<br/>and professional voice</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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

        {/* Comment Settings Row - Collapsible */}
        <div className="space-y-2">
          <div
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsCommentSettingsExpanded(!isCommentSettingsExpanded)}
          >
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <Label className="cursor-pointer text-foreground font-medium">Comment Settings</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Control the length of generated comments and <br />Set your preferred daily comment volume.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors">
              {isCommentSettingsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>

          {isCommentSettingsExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Comment Size */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-foreground font-medium">Comment Size</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>Control the length of generated comments.<br/>Shorter comments tend to get more engagement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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

              {/* Comments Per Day */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-foreground font-medium">Comments Per Day</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                          <Info className="w-3 h-3 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p>Set your preferred daily comment volume.<br/>Higher numbers increase engagement<br/>but may appear less authentic</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={commentsPerDay}
                  onChange={(e) => {
                    const val = Math.min(100, Math.max(0, Number(e.target.value)))
                    setCommentsPerDay(val)
                  }}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 bg-card border-border text-card-foreground"
                />
              </div>
            </div>
          )}
        </div>

        {/* Style Preferences - Collapsible */}
        <div className="space-y-2">
          <div
            className="flex items-center justify-between cursor-pointer group"
            onClick={() => setIsStylePreferencesExpanded(!isStylePreferencesExpanded)}
          >
            <div className="flex items-center gap-2">
              <Smile className="h-4 w-4 text-muted-foreground" />
              <Label className="cursor-pointer text-foreground font-medium">Style Preferences</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Customize the tone and style of your<br/>automated comments for better<br/>alignment with your brand</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors">
              {isStylePreferencesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>

          {isStylePreferencesExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {/* Emojis Toggle Card */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:shadow-sm transition-shadow">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-card-foreground">Use Emojis</Label>
                  <p className="text-xs text-muted-foreground">Include relevant emojis in comments</p>
                </div>
                <Switch 
                  id="emojis" 
                  checked={useEmojis} 
                  onCheckedChange={setUseEmojis} 
                />
              </div>

              {/* Exclamations Toggle Card */}
              <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:shadow-sm transition-shadow">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-card-foreground">Use Exclamations</Label>
                  <p className="text-xs text-muted-foreground">Add emphasis with exclamation points</p>
                </div>
                <Switch
                  id="exclamations"
                  checked={useExclamations}
                  onCheckedChange={setUseExclamations}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <OnboardingNavigation nextStep="/onboarding/demo" />
    </OnboardingCard>
  )
}