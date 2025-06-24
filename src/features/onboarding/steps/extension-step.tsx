'use client'

import { useState, useEffect } from 'react'
import { Download, CheckCircle2, Info } from 'lucide-react'
import { useOnboarding } from '@/context/onboarding-context'
import { Button } from '@/components/ui/button'
import { OnboardingCard } from '@/features/onboarding/onboarding-card'
import { OnboardingNavigation } from '../onboarding-navigation'
import { envConfig } from "@/config/env.config";
import {
  checkIsExtensionInstalled,
} from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ExtensionStep() {
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const { data, updateData, markStepCompleted } = useOnboarding()
  const [checking, setChecking] = useState(false)

  // Use the stored value from context
  const isInstalled = data.isExtensionInstalled

  const checkIfExtensionIsInstalled = async () => {
    const isInstalled = await checkIsExtensionInstalled(
      envConfig.chromeExtensionId,
      envConfig.chromeExtensionIconUrl
    );
    setIsExtensionInstalled(isInstalled);
    setChecking(false)
    updateData({ isExtensionInstalled: true })
    markStepCompleted('extension')
  };

  useEffect(() => {
    checkIfExtensionIsInstalled();
  }, []);

  // Mark step as visited when component mounts
  useEffect(() => {
    if (isInstalled) {
      markStepCompleted('extension')
    }
  }, [isInstalled, markStepCompleted])

  return (
    <div className='space-y-8'>
      <OnboardingCard
        title={
          <div className="flex items-center gap-2">
            Install the Chrome Extension
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>The extension runs in the background to automate<br/>comments on LinkedIn posts you interact with</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        }
        description='To automate LinkedIn comments, you need to install our Chrome extension.'
      >
        <div className='flex flex-col items-center space-y-6 py-4'>
          <div className='relative flex h-64 w-full max-w-md items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800'>
            <img
              // src='https://res.cloudinary.com/djpcpmrjd/image/upload/v1750668232/uploads/file-1750668230803-776491940-unnamed.png.png'
              // alt='Extension Screenshot'
              // className='h-full w-full object-cover'
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help bg-background">
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>After installation, the extension icon will appear<br/>in your Chrome toolbar for easy access</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {isInstalled ? (
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
                  window.open('https://chromewebstore.google.com/detail/commentify-automate-linke/efmnkiklpnaekhleodlncoembopfmjca?hl=en-US', '_blank')
                }
              >
                <Download className='mr-2 h-4 w-4' />
                Install Extension
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help bg-background">
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <p>You'll be redirected to the Chrome Web Store<br/>to complete the installation process</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Why do we need this?</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-4 h-4 rounded-full border border-border flex items-center justify-center cursor-help">
                        <Info className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      <p>The extension is required to interact with LinkedIn<br/>securely and automate comments without<br/>violating their terms of service</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>
        
        {/* Move OnboardingNavigation outside the centered container */}
        {isInstalled && <OnboardingNavigation nextStep='/onboarding/linkedin' />}
      </OnboardingCard>
    </div>
  )
}