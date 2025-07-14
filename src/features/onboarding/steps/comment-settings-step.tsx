'use client'

import { useState } from 'react'
import {
  MessageSquare,
  Settings,
  Smile,
  Calendar,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { OnboardingCard } from '../onboarding-card'
import { OnboardingNavigation } from '../onboarding-navigation'

export function CommentSettingsStep() {
  const [aboutProfile, setAboutProfile] = useState('')
  const [commentStyle, setCommentStyle] = useState('balanced')
  const [commentsPerDay, setCommentsPerDay] = useState(10)
  const [isStylePreferencesExpanded, setIsStylePreferencesExpanded] =
    useState(false)
  const [isCommentSettingsExpanded, setIsCommentSettingsExpanded] =
    useState(false)
  const [useEmojis, setUseEmojis] = useState(true)
  const [useExclamations, setUseExclamations] = useState(true)

  return (
    <OnboardingCard
      title='Comment Generation Settings'
      description='Configure how your automated comments will be generated and styled.'
    >
      <div className='mb-8 space-y-6'>
        {/* About Profile Section */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <MessageSquare className='text-muted-foreground h-4 w-4' />
            <Label
              htmlFor='about-profile'
              className='text-foreground font-medium'
            >
              About Your Profile
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='border-border flex h-4 w-4 cursor-help items-center justify-center rounded-full border'>
                    <Info className='text-muted-foreground h-3 w-3' />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right' className='max-w-xs'>
                  <p>
                    Describe your background to help generate
                    <br />
                    comments that match your expertise
                    <br />
                    and professional voice
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Textarea
            id='about-profile'
            value={aboutProfile}
            onChange={(e) => setAboutProfile(e.target.value)}
            placeholder='Describe your professional background, expertise, and interests to help generate relevant comments'
            className='focus-visible:ring-primary bg-card border-border text-card-foreground min-h-[120px] focus-visible:ring-2 focus-visible:ring-offset-2'
          />
          <span className='text-muted-foreground text-xs'>
            This helps our AI understand your voice and expertise
          </span>
        </div>

        {/* Comment Settings Row - Collapsible */}
        <div className='space-y-2'>
          <div
            className='group flex cursor-pointer items-center justify-between'
            onClick={() =>
              setIsCommentSettingsExpanded(!isCommentSettingsExpanded)
            }
          >
            <div className='flex items-center gap-2'>
              <Settings className='text-muted-foreground h-4 w-4' />
              <Label className='text-foreground cursor-pointer font-medium'>
                Comment Settings
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='border-border flex h-4 w-4 cursor-help items-center justify-center rounded-full border'>
                      <Info className='text-muted-foreground h-3 w-3' />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='right' className='max-w-xs'>
                    <p>
                      Control the length of generated comments and <br />
                      Set your preferred daily comment volume.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='text-muted-foreground group-hover:text-foreground flex items-center transition-colors'>
              {isCommentSettingsExpanded ? (
                <ChevronUp className='h-4 w-4' />
              ) : (
                <ChevronDown className='h-4 w-4' />
              )}
            </div>
          </div>

          {isCommentSettingsExpanded && (
            <div className='grid grid-cols-1 gap-6 pt-4 md:grid-cols-2'>
              {/* Comment Size */}
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Label className='text-foreground font-medium'>
                    Comment Size
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='border-border flex h-4 w-4 cursor-help items-center justify-center rounded-full border'>
                          <Info className='text-muted-foreground h-3 w-3' />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side='right' className='max-w-xs'>
                        <p>
                          Control the length of generated comments.
                          <br />
                          Shorter comments tend to get more engagement
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Select value={commentStyle} onValueChange={setCommentStyle}>
                  <SelectTrigger className='focus-visible:ring-primary bg-card border-border text-card-foreground focus-visible:ring-2 focus-visible:ring-offset-2'>
                    <SelectValue placeholder='Select comment style' />
                  </SelectTrigger>
                  <SelectContent className='bg-popover border-border'>
                    <SelectItem value='balanced'>Short (10 words)</SelectItem>
                    <SelectItem value='casual'>Medium (15 words)</SelectItem>
                    <SelectItem value='enthusiastic'>
                      Large (25 words)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Comments Per Day */}
              <div className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Calendar className='text-muted-foreground h-4 w-4' />
                  <Label className='text-foreground font-medium'>
                    Comments Per Day
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className='border-border flex h-4 w-4 cursor-help items-center justify-center rounded-full border'>
                          <Info className='text-muted-foreground h-3 w-3' />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side='right' className='max-w-xs'>
                        <p>
                          Set your preferred daily comment volume.
                          <br />
                          Higher numbers increase engagement
                          <br />
                          but may appear less authentic
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  value={commentsPerDay}
                  onChange={(e) => {
                    const val = Math.min(
                      100,
                      Math.max(0, Number(e.target.value))
                    )
                    setCommentsPerDay(val)
                  }}
                  className='focus-visible:ring-primary bg-card border-border text-card-foreground focus-visible:ring-2 focus-visible:ring-offset-2'
                />
              </div>
            </div>
          )}
        </div>

        {/* Style Preferences - Collapsible */}
        <div className='space-y-2'>
          <div
            className='group flex cursor-pointer items-center justify-between'
            onClick={() =>
              setIsStylePreferencesExpanded(!isStylePreferencesExpanded)
            }
          >
            <div className='flex items-center gap-2'>
              <Smile className='text-muted-foreground h-4 w-4' />
              <Label className='text-foreground cursor-pointer font-medium'>
                Style Preferences
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='border-border flex h-4 w-4 cursor-help items-center justify-center rounded-full border'>
                      <Info className='text-muted-foreground h-3 w-3' />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='right' className='max-w-xs'>
                    <p>
                      Customize the tone and style of your
                      <br />
                      automated comments for better
                      <br />
                      alignment with your brand
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className='text-muted-foreground group-hover:text-foreground flex items-center transition-colors'>
              {isStylePreferencesExpanded ? (
                <ChevronUp className='h-4 w-4' />
              ) : (
                <ChevronDown className='h-4 w-4' />
              )}
            </div>
          </div>

          {isStylePreferencesExpanded && (
            <div className='grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2'>
              {/* Emojis Toggle Card */}
              <div className='border-border bg-card flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-sm'>
                <div className='space-y-1'>
                  <Label className='text-card-foreground text-sm font-medium'>
                    Use Emojis
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    Include relevant emojis in comments
                  </p>
                </div>
                <Switch
                  id='emojis'
                  checked={useEmojis}
                  onCheckedChange={setUseEmojis}
                />
              </div>

              {/* Exclamations Toggle Card */}
              <div className='border-border bg-card flex items-center justify-between rounded-lg border p-4 transition-shadow hover:shadow-sm'>
                <div className='space-y-1'>
                  <Label className='text-card-foreground text-sm font-medium'>
                    Use Exclamations
                  </Label>
                  <p className='text-muted-foreground text-xs'>
                    Add emphasis with exclamation points
                  </p>
                </div>
                <Switch
                  id='exclamations'
                  checked={useExclamations}
                  onCheckedChange={setUseExclamations}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <OnboardingNavigation nextStep='/onboarding/demo' />
    </OnboardingCard>
  )
}
