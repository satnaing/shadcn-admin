"use client"

import { useEffect, useState } from "react"
import { Smile, Globe, Calendar, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { OnboardingCard } from "../onboarding-card"
import { useOnboarding } from "@/context/onboarding-context"
import { OnboardingNavigation } from "../onboarding-navigation"

const authorTitlesList = ["Founder", "Co-founder", "CEO", "CTO", "CFO", "CMO", "COO", "VP", "Director", "Manager"]

export function OtherSettingStep() {
  const {
    data: { commentsPerDay, authorTitles, geography, useEmojis, useExclamations },
    updateData,
    markStepCompleted,
  } = useOnboarding()

  const [isStylePreferencesExpanded, setIsStylePreferencesExpanded] = useState(false)

  useEffect(() => {
    markStepCompleted("other-settings")
  }, [commentsPerDay, authorTitles, geography, useEmojis, useExclamations])

  const toggleTitle = (title: string) => {
    const updated = authorTitles.includes(title) ? authorTitles.filter((t) => t !== title) : [...authorTitles, title]
    updateData({ authorTitles: updated })
  }

  return (
    <OnboardingCard title="Setup Preferences" description="Select your preferences to personalize your experience.">
      {/* Author Titles Selection */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Label className="text-foreground font-medium">Author Titles</Label>
        </div>
        <div className="flex flex-wrap gap-2">
          {authorTitlesList.map((title) => {
            const isSelected = authorTitles.includes(title)
            return (
              <button
                key={title}
                onClick={() => toggleTitle(title)}
                className={`px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium flex items-center gap-1 ${
                  isSelected
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                {title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Comments Per Day and Geography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="flex-1 max-w-[200px] space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Label className="text-foreground font-medium">Comments Per Day</Label>
          </div>
          <Input
            type="number"
            min={0}
            max={100}
            value={commentsPerDay}
            onChange={(e) => {
              const val = Math.min(100, Math.max(0, Number(e.target.value)))
              updateData({ commentsPerDay: val })
            }}
            className="bg-card border-border text-card-foreground focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Label className="text-foreground font-medium">Geography</Label>
          </div>
          <Select value={geography} onValueChange={(v) => updateData({ geography: v })}>
            <SelectTrigger className="bg-card border-border text-card-foreground focus-visible:ring-primary">
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="north-america">North America</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Style Preferences with Collapsible Functionality */}
      <div className="space-y-2 mb-6">
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsStylePreferencesExpanded(!isStylePreferencesExpanded)}
        >
          <div className="flex items-center gap-2">
            <Smile className="h-4 w-4 text-muted-foreground" />
            <Label className="cursor-pointer text-foreground font-medium">Style Preferences</Label>
          </div>
          <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors">
            {isStylePreferencesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>

        {isStylePreferencesExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Emojis Toggle Card */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:shadow-sm transition-shadow">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-card-foreground">Use Emojis</Label>
                <p className="text-xs text-muted-foreground">Include relevant emojis in comments</p>
              </div>
              <Switch id="emojis" checked={useEmojis} onCheckedChange={(v) => updateData({ useEmojis: v })} />
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
                onCheckedChange={(v) => updateData({ useExclamations: v })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <OnboardingNavigation nextStep="/onboarding/demo" />
    </OnboardingCard>
  )
}
