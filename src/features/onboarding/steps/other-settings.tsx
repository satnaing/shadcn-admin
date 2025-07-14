'use client'

import { useEffect, useState } from 'react'
import {
  Smile,
  Globe,
  Calendar,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useOnboarding } from '@/context/onboarding-context'
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
import { OnboardingCard } from '../onboarding-card'
import { OnboardingNavigation } from '../onboarding-navigation'

const authorTitlesList = [
  'Founder',
  'Co-founder',
  'CEO',
  'CTO',
  'CFO',
  'CMO',
  'COO',
  'VP',
  'Director',
  'Manager',
]

export function OtherSettingStep() {
  const {
    data: {
      commentsPerDay,
      authorTitles,
      geography,
      useEmojis,
      useExclamations,
    },
    updateData,
    markStepCompleted,
  } = useOnboarding()

  const [isStylePreferencesExpanded, setIsStylePreferencesExpanded] =
    useState(false)

  useEffect(() => {
    markStepCompleted('other-settings')
  }, [commentsPerDay, authorTitles, geography, useEmojis, useExclamations])

  const toggleTitle = (title: string) => {
    const updated = authorTitles.includes(title)
      ? authorTitles.filter((t) => t !== title)
      : [...authorTitles, title]
    updateData({ authorTitles: updated })
  }

  return (
    <OnboardingCard
      title='Setup Preferences'
      description='Select your preferences to personalize your experience.'
    >
      {/* Author Titles Selection */}
      <div className='mb-6 space-y-4'>
        <div className='flex items-center gap-2'>
          <Filter className='text-muted-foreground h-4 w-4' />
          <Label className='text-foreground font-medium'>Author Titles</Label>
        </div>
        <div className='flex flex-wrap gap-2'>
          {authorTitlesList.map((title) => {
            const isSelected = authorTitles.includes(title)
            return (
              <button
                key={title}
                onClick={() => toggleTitle(title)}
                className={`flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-card border-border text-card-foreground hover:border-primary/30 hover:shadow-sm'
                }`}
              >
                {title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Comments Per Day and Geography */}
      <div className='mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2'>
        <div className='max-w-[200px] flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            <Calendar className='text-muted-foreground h-4 w-4' />
            <Label className='text-foreground font-medium'>
              Comments Per Day
            </Label>
          </div>
          <Input
            type='number'
            min={0}
            max={100}
            value={commentsPerDay}
            onChange={(e) => {
              const val = Math.min(100, Math.max(0, Number(e.target.value)))
              updateData({ commentsPerDay: val })
            }}
            className='bg-card border-border text-card-foreground focus-visible:ring-primary'
          />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Globe className='text-muted-foreground h-4 w-4' />
            <Label className='text-foreground font-medium'>Geography</Label>
          </div>
          <Select
            value={geography}
            onValueChange={(v) => updateData({ geography: v })}
          >
            <SelectTrigger className='bg-card border-border text-card-foreground focus-visible:ring-primary'>
              <SelectValue placeholder='Select region' />
            </SelectTrigger>
            <SelectContent className='bg-popover border-border'>
              <SelectItem value='global'>Global</SelectItem>
              <SelectItem value='north-america'>North America</SelectItem>
              <SelectItem value='europe'>Europe</SelectItem>
              <SelectItem value='asia'>Asia</SelectItem>
              <SelectItem value='custom'>Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Style Preferences with Collapsible Functionality */}
      <div className='mb-6 space-y-2'>
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
          <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
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
                onCheckedChange={(v) => updateData({ useEmojis: v })}
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
                onCheckedChange={(v) => updateData({ useExclamations: v })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Next Button */}
      <OnboardingNavigation nextStep='/onboarding/demo' />
    </OnboardingCard>
  )
}
