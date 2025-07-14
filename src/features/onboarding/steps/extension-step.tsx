'use client'

import { useState, useEffect } from 'react'
import { envConfig } from '@/config/env.config'
import { Download, CheckCircle2, Info } from 'lucide-react'
import { checkIsExtensionInstalled } from '@/lib/utils'
import { useOnboarding } from '@/context/onboarding-context'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { OnboardingCard } from '@/features/onboarding/onboarding-card'
import { OnboardingNavigation } from '../onboarding-navigation'

export function ExtensionStep() {
  const [isChecking, setIsChecking] = useState(true)
  const { data, updateData, markStepCompleted } = useOnboarding()
  const isInstalled = data.isExtensionInstalled

  const checkExtensionInstallation = async () => {
    try {
      setIsChecking(true)
      const installed = await checkIsExtensionInstalled(
        envConfig.chromeExtensionId,
        envConfig.chromeExtensionIconUrl
      )

      if (installed) {
        updateData({ isExtensionInstalled: true })
        markStepCompleted('extension')
      }
    } catch (error) {
      console.error('Error checking extension:', error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    // Initial check
    checkExtensionInstallation()

    // Set up periodic checks every 2 seconds
    const intervalId = setInterval(checkExtensionInstallation, 2000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className='space-y-8'>
      <OnboardingCard
        title={
          <div className='flex items-center gap-2'>
            Install the Chrome Extension
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='border-border flex h-4 w-4 cursor-help items-center justify-center rounded-full border'>
                    <Info className='text-muted-foreground h-3 w-3' />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='right' className='max-w-xs'>
                  <p>
                    The extension runs in the background to automate
                    <br />
                    comments on LinkedIn posts you interact with
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
        description='To automate LinkedIn comments, you need to install our Chrome extension.'
      >
        <div className='flex flex-col items-center space-y-6 py-4'>
          <div className='relative flex h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800'>
            <div className='absolute inset-0 flex items-center justify-center'>
              {isChecking ? (
                <div className='text-muted-foreground animate-pulse'>
                  Checking for extension...
                </div>
              ) : (
                <div className='p-4 text-center'>
                  <div className='mb-2 text-lg font-medium'>
                    {isInstalled ? 'Extension Active' : 'Extension Required'}
                  </div>
                  <p className='text-muted-foreground text-sm'>
                    {isInstalled
                      ? 'Our extension is ready to automate your LinkedIn comments'
                      : 'Install to enable automated commenting on LinkedIn'}
                  </p>
                </div>
              )}
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className='border-border bg-background absolute right-2 bottom-2 flex h-4 w-4 cursor-help items-center justify-center rounded-full border'>
                    <Info className='text-muted-foreground h-3 w-3' />
                  </div>
                </TooltipTrigger>
                <TooltipContent side='top' className='max-w-xs'>
                  <p>
                    After installation, the extension icon will appear
                    <br />
                    in your Chrome toolbar for easy access
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {isChecking ? (
            <div className='text-muted-foreground flex items-center gap-2'>
              <div className='border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent' />
              <span>Checking installation status...</span>
            </div>
          ) : isInstalled ? (
            <div className='flex items-center gap-2 text-green-500 dark:text-green-400'>
              <CheckCircle2 className='h-5 w-5' />
              <span className='font-medium'>
                Extension installed successfully!
              </span>
            </div>
          ) : (
            <div className='w-full max-w-xs space-y-4'>
              <Button
                className='relative w-full overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95'
                onClick={() =>
                  window.open(
                    envConfig.extensionUrl ||
                      'https://chromewebstore.google.com',
                    '_blank'
                  )
                }
              >
                <Download className='mr-2 h-4 w-4' />
                Install Extension
              </Button>
            </div>
          )}
        </div>

        {isInstalled && (
          <OnboardingNavigation nextStep='/onboarding/linkedin' />
        )}
      </OnboardingCard>
    </div>
  )
}
