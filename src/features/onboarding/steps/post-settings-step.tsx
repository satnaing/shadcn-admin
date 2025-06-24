"use client"

import { useState } from "react"
import { Hash, Info, PlusCircle, Filter, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { OnboardingCard } from "../onboarding-card"
import { OnboardingNavigation } from "../onboarding-navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const authorTitlesList = ["Founder", "Co-founder", "CEO", "CTO", "CFO", "CMO", "COO", "VP", "Director", "Manager"]

export function PostSettingsStep() {
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>(["AI", "SaaS"])
  const [showCustomKeywordInput, setShowCustomKeywordInput] = useState(false)
  const [customKeyword, setCustomKeyword] = useState("")
  const [customKeywords, setCustomKeywords] = useState<string[]>([])
  const [isAuthorTitlesExpanded, setIsAuthorTitlesExpanded] = useState(false)
  const [showCustomTitleInput, setShowCustomTitleInput] = useState(false)
  const [customTitle, setCustomTitle] = useState("")
  const [customTitles, setCustomTitles] = useState<string[]>([])
  const [isGeographyExpanded, setIsGeographyExpanded] = useState(false)
  const [geography, setGeography] = useState("global")
  const [authorTitles, setAuthorTitles] = useState<string[]>([])

  const predefinedKeywords = [
    "AI", "SaaS", "Tech", "Startup", "Marketing", "Sales", 
    "Leadership", "Product", "Design", "Engineering", "Finance", 
    "Operations", "HR", "Consulting", "Analytics", "Growth"
  ]

  const allKeywords = [...predefinedKeywords, ...customKeywords]
  const allTitles = [...authorTitlesList, ...customTitles]

  // Keyword functions (unchanged)
  const handleKeywordSelect = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      setSelectedKeywords(selectedKeywords.filter(k => k !== keyword))
    } else if (selectedKeywords.length < 6) {
      setSelectedKeywords([...selectedKeywords, keyword])
    }
  }

  const handleKeywordOtherClick = () => {
    setShowCustomKeywordInput(true)
  }

  const handleCustomKeywordSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const trimmedKeyword = customKeyword.trim()
      if (trimmedKeyword && 
          !allKeywords.includes(trimmedKeyword) && 
          selectedKeywords.length < 6) {
        setCustomKeywords([...customKeywords, trimmedKeyword])
        setSelectedKeywords([...selectedKeywords, trimmedKeyword])
      }
      setCustomKeyword("")
      setShowCustomKeywordInput(false)
    }
  }

  // Author Title functions
  const toggleTitle = (title: string) => {
    const updated = authorTitles.includes(title) 
      ? authorTitles.filter((t) => t !== title) 
      : [...authorTitles, title]
    setAuthorTitles(updated)
  }

  const handleTitleOtherClick = () => {
    setShowCustomTitleInput(true)
  }

  const handleCustomTitleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const trimmedTitle = customTitle.trim()
      if (trimmedTitle && !allTitles.includes(trimmedTitle)) {
        setCustomTitles([...customTitles, trimmedTitle])
        setAuthorTitles([...authorTitles, trimmedTitle])
      }
      setCustomTitle("")
      setShowCustomTitleInput(false)
    }
  }

  return (
    <OnboardingCard
      title="Post Settings"
      description="Configure your preferences for posts and authors"
    >
      {/* Keywords Section (unchanged) */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Hash className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-semibold">Select keywords (Choose up to 6)</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                  <Info className="w-3 h-3 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                <p>Select keywords related to your industry<br/>or interests to find relevant posts<br/>for automated commenting</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            {allKeywords.map((keyword) => {
              const isSelected = selectedKeywords.includes(keyword)
              const isDisabled = !isSelected && selectedKeywords.length >= 6

              return (
                <button
                  key={keyword}
                  onClick={() => handleKeywordSelect(keyword)}
                  disabled={isDisabled}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/10 border-primary text-primary"
                      : isDisabled
                      ? "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50"
                      : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  <span className="text-sm font-medium">{keyword}</span>
                </button>
              )
            })}
            
            {!showCustomKeywordInput ? (
              <button
                onClick={handleKeywordOtherClick}
                disabled={selectedKeywords.length >= 6}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  selectedKeywords.length >= 6
                    ? "bg-muted border-border text-muted-foreground cursor-not-allowed opacity-50"
                    : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <span className="flex items-center gap-1 text-sm font-medium">
                  <PlusCircle className="w-4 h-4" />
                  Other
                </span>
              </button>
            ) : (
              <Input
                placeholder="Enter keyword..."
                value={customKeyword}
                onChange={(e) => setCustomKeyword(e.target.value)}
                onKeyPress={handleCustomKeywordSubmit}
                onBlur={() => setShowCustomKeywordInput(false)}
                autoFocus
                className="w-32 h-10"
              />
            )}
          </div>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          {selectedKeywords.length}/6 keywords selected
        </p>
      </div>

      {/* Author Titles Section */}
      <div className="space-y-2 mb-6">
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsAuthorTitlesExpanded(!isAuthorTitlesExpanded)}
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Label className="cursor-pointer text-foreground font-medium">Author Titles</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>Select titles of authors whose posts<br/>you want to engage with</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors">
            {isAuthorTitlesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>

        {isAuthorTitlesExpanded && (
          <div className="space-y-3 mt-4">
            <div className="flex flex-wrap gap-3">
              {allTitles.map((title) => {
                const isSelected = authorTitles.includes(title)
                return (
                  <button
                    key={title}
                    onClick={() => toggleTitle(title)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                    }`}
                  >
                    <span className="text-sm font-medium">{title}</span>
                  </button>
                )
              })}
              
              {!showCustomTitleInput ? (
                <button
                  onClick={handleTitleOtherClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-card-foreground hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                >
                  <span className="flex items-center gap-1 text-sm font-medium">
                    <PlusCircle className="w-4 h-4" />
                    Other
                  </span>
                </button>
              ) : (
                <Input
                  placeholder="Enter title..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  onKeyPress={handleCustomTitleSubmit}
                  onBlur={() => setShowCustomTitleInput(false)}
                  autoFocus
                  className="w-32 h-10"
                />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {authorTitles.length} titles selected
            </p>
          </div>
        )}
      </div>

      {/* Geography Section */}
      <div className="space-y-2 mb-6">
        <div
          className="flex items-center justify-between cursor-pointer group"
          onClick={() => setIsGeographyExpanded(!isGeographyExpanded)}
        >
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Label className="cursor-pointer text-foreground font-medium">Geography</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>Select geographic regions where<br/>you want to focus your engagement</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center text-muted-foreground group-hover:text-foreground transition-colors">
            {isGeographyExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>

        {isGeographyExpanded && (
          <div className="space-y-3 mt-4">
            <div className="flex flex-wrap gap-3">
              {["global", "north-america", "europe", "asia"].map((region) => {
                const isSelected = geography === region
                const displayName = {
                  "global": "Global",
                  "north-america": "North America",
                  "europe": "Europe",
                  "asia": "Asia"
                }[region]
                
                return (
                  <button
                    key={region}
                    onClick={() => setGeography(region)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                    }`}
                  >
                    <span className="text-sm font-medium">{displayName}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <OnboardingNavigation nextStep="/onboarding/comment-settings" />
    </OnboardingCard>
  )
}