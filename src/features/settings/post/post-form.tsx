"use client"

import { useState } from "react"
import { Hash, Info, PlusCircle, Filter, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form } from '@/components/ui/form'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { buildSearchUrl } from '@/features/settings/utils/linkedin.util'

const notificationsFormSchema = z.object({
  keywords: z.array(z.string()).max(6),
  authorTitles: z.array(z.string()),
  geography: z.enum(['global', 'north-america', 'europe', 'asia']),
  numberOfPostsToScrapePerDay: z.number().min(1).max(50),
  engagementThreshold: z.enum(['strict', 'moderate', 'disabled']),
  skipHiringPosts: z.boolean(),
  skipJobUpdatePosts: z.boolean(),
  skipArticlePosts: z.boolean(),
  autoSchedule: z.boolean(),
  rules: z.string().optional(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

const authorTitlesList = ["Founder", "Co-founder", "CEO", "CTO", "CFO", "CMO", "COO", "VP", "Director", "Manager"]
const predefinedKeywords = [
  "AI", "SaaS", "Tech", "Startup", "Marketing", "Sales", 
  "Leadership", "Product", "Design", "Engineering", "Finance", 
  "Operations", "HR", "Consulting", "Analytics", "Growth"
]

export function PostForm() {
  const [showCustomKeywordInput, setShowCustomKeywordInput] = useState(false)
  const [customKeyword, setCustomKeyword] = useState("")
  const [customKeywords, setCustomKeywords] = useState<string[]>([])
  const [isAuthorTitlesExpanded, setIsAuthorTitlesExpanded] = useState(true)
  const [showCustomTitleInput, setShowCustomTitleInput] = useState(false)
  const [customTitle, setCustomTitle] = useState("")
  const [customTitles, setCustomTitles] = useState<string[]>([])
  const [isGeographyExpanded, setIsGeographyExpanded] = useState(true)

  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      keywords: ["AI", "SaaS"],
      authorTitles: [],
      geography: "global",
      numberOfPostsToScrapePerDay: 20,
      engagementThreshold: "moderate",
      skipHiringPosts: true,
      skipJobUpdatePosts: true,
      skipArticlePosts: true,
      autoSchedule: true,
      rules: ""
    }
  })

  const allKeywords = [...predefinedKeywords, ...customKeywords]
  const allTitles = [...authorTitlesList, ...customTitles]
  const selectedKeywords = form.watch("keywords") || []
  const authorTitles = form.watch("authorTitles") || []
  const geography = form.watch("geography")

  // Build LinkedIn search URL for selected keywords
  const liSearchUrl = buildSearchUrl(selectedKeywords)

  const handleKeywordSelect = (keyword: string) => {
    if (selectedKeywords.includes(keyword)) {
      form.setValue("keywords", selectedKeywords.filter(k => k !== keyword))
    } else if (selectedKeywords.length < 6) {
      form.setValue("keywords", [...selectedKeywords, keyword])
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
        form.setValue("keywords", [...selectedKeywords, trimmedKeyword])
      }
      setCustomKeyword("")
      setShowCustomKeywordInput(false)
    }
  }

  const toggleTitle = (title: string) => {
    const updated = authorTitles.includes(title) 
      ? authorTitles.filter((t) => t !== title) 
      : [...authorTitles, title]
    form.setValue("authorTitles", updated)
  }

  const handleTitleOtherClick = () => {
    setShowCustomTitleInput(true)
  }

  const handleCustomTitleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const trimmedTitle = customTitle.trim()
      if (trimmedTitle && !allTitles.includes(trimmedTitle)) {
        setCustomTitles([...customTitles, trimmedTitle])
        form.setValue("authorTitles", [...authorTitles, trimmedTitle])
      }
      setCustomTitle("")
      setShowCustomTitleInput(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => showSubmittedData(data))}
        className="space-y-8"
      >
       
        {/* Keywords Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-semibold">Target Keywords (Choose up to 6)</span>
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
                    type="button"
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
                  type="button"
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

          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedKeywords.length}/6 keywords selected
            </p>
            {selectedKeywords.length > 0 && (
              <a 
                href={liSearchUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                Preview LinkedIn posts for these keywords
              </a>
            )}
          </div>
        </div>

        {/* Posts Per Day */}
        <div className="mb-6">
          <Label className="text-foreground font-semibold">Number of posts to comment per day</Label>
          <Input
            type="number"
            min={1}
            max={50}
            className="mt-2 w-32"
            {...form.register("numberOfPostsToScrapePerDay", { valueAsNumber: true })}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Max. 50 posts per day
          </p>
        </div>

        {/* Engagement Threshold */}
        <div className="mb-6">
          <Label className="text-foreground font-semibold">Comment Monitoring Based on Engagement</Label>
          <div className="flex flex-wrap gap-3 mt-3">
            {[
              { value: "strict", label: "Strict Engagement Check" },
              { value: "moderate", label: "Moderate Engagement Check" },
              { value: "disabled", label: "Comment Immediately" }
            ].map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => form.setValue("engagementThreshold", option.value as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                  form.watch("engagementThreshold") === option.value
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose when to post comments based on the engagement level
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
                      type="button"
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
                    type="button"
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
                      type="button"
                      key={region}
                      onClick={() => form.setValue("geography", region as any)}
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

        {/* Skip Options */}
        <div className="space-y-4 mb-6">
          <Label className="text-foreground font-semibold">Skip commenting on</Label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="skipHiringPosts"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...form.register("skipHiringPosts")}
              />
              <Label htmlFor="skipHiringPosts">Hiring Posts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="skipJobUpdatePosts"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...form.register("skipJobUpdatePosts")}
              />
              <Label htmlFor="skipJobUpdatePosts">Job Update Posts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="skipArticlePosts"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                {...form.register("skipArticlePosts")}
              />
              <Label htmlFor="skipArticlePosts">Article Posts</Label>
            </div>
          </div>
        </div>

        {/* Auto Schedule */}
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="checkbox"
            id="autoSchedule"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            {...form.register("autoSchedule")}
          />
          <Label htmlFor="autoSchedule">Post comments automatically</Label>
        </div>

        {/* Additional Rules */}
        <div className="mb-6">
          <Label className="text-foreground font-semibold">Additional Post Evaluation Rules</Label>
          <textarea
            className="mt-2 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Set a rule, e.g., Skip posts with hashtags like #ad or #sponsored."
            rows={3}
            {...form.register("rules")}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Specify rules to decide if a post is worth commenting on.
          </p>
        </div>

        <Button type="submit">Update settings</Button>
      </form>
    </Form>
  )
}