"use client"

import { useState, useEffect, type KeyboardEvent } from "react"
import { Filter, Globe, Hash, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { OnboardingCard } from "@/features/onboarding/onboarding-card"
import { OnboardingNavigation } from "@/features/onboarding/onboarding-navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOnboarding } from "@/context/onboarding-context"

export function PostSettingsStep() {
  const { data, updateData, markStepCompleted } = useOnboarding()
  const [currentKeyword, setCurrentKeyword] = useState("")

  // Use stored values from context
  const keywords = data.keywords
  const commentsPerDay = data.commentsPerDay
  const authorTitle = data.authorTitle
  const geography = data.geography

  const addKeyword = () => {
    if (currentKeyword && !keywords.includes(currentKeyword)) {
      const updatedKeywords = [...keywords, currentKeyword]
      updateData({ keywords: updatedKeywords })
      setCurrentKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    const updatedKeywords = keywords.filter((k) => k !== keyword)
    updateData({ keywords: updatedKeywords })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyword()
    }
  }

  // Mark step as visited when component mounts or when form is filled
  useEffect(() => {
    const isFormFilled =
      keywords.length > 0 || commentsPerDay !== 10 || authorTitle !== "generic" || geography !== "global"
    if (isFormFilled) {
      markStepCompleted("post-settings")
    }
  }, [keywords, commentsPerDay, authorTitle, geography, markStepCompleted])

  return (
    <div className="space-y-8">
      <OnboardingCard
        title="Post Evaluation Settings"
        description="Configure how we find and select LinkedIn posts for commenting."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="keywords">Target Keywords</Label>
            </div>
            <div className="flex gap-2">
              <Input
                id="keywords"
                value={currentKeyword}
                onChange={(e) => setCurrentKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add keywords (e.g., marketing, leadership)"
                className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button
                type="button"
                onClick={addKeyword}
                variant="secondary"
                className="relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="px-3 py-1">
                  {keyword}
                  <button className="ml-2 text-xs" onClick={() => removeKeyword(keyword)}>
                    ×
                  </button>
                </Badge>
              ))}
              {keywords.length === 0 && <span className="text-sm text-muted-foreground">No keywords added yet</span>}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Label>Comments Per Day: {commentsPerDay}</Label>
            </div>
            <Slider
              value={[commentsPerDay]}
              max={50}
              step={1}
              onValueChange={(value) => updateData({ commentsPerDay: value[0] })}
              className="py-4"
            />
            <span className="text-xs text-muted-foreground">Limit how many comments are posted daily (1-50)</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="author-title">Author Titles</Label>
            </div>
            <Select value={authorTitle} onValueChange={(value) => updateData({ authorTitle: value })}>
              <SelectTrigger
                id="author-title"
                className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <SelectValue placeholder="Select title preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generic">Generic Titles (Recommended)</SelectItem>
                <SelectItem value="specific">Specific Titles</SelectItem>
                <SelectItem value="all">All Titles</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">
              Generic titles like "Chief" cover most C-level positions
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="geography">Geography</Label>
            </div>
            <Select value={geography} onValueChange={(value) => updateData({ geography: value })}>
              <SelectTrigger
                id="geography"
                className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <SelectValue placeholder="Select geographic focus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </OnboardingCard>

      <OnboardingNavigation
        prevStep="/onboarding/linkedin"
        nextStep="/onboarding/comment-settings"
        onNext={() => {
          markStepCompleted("post-settings")
          return true
        }}
      />
    </div>
  )
}
