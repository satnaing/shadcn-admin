import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useThemeT } from '../hooks/useThemeT'

export interface FormTab {
  value: string
  labelKey: string
  content: ReactNode
}

/** Splits a long block form into tabs; inactive panels stay mounted so form state is shared. */
export function FormTabs({ tabs }: { tabs: FormTab[] }) {
  const t = useThemeT()

  return (
    <Tabs defaultValue={tabs[0].value} className='space-y-4'>
      <TabsList className='h-auto flex-wrap justify-start'>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {t(tab.labelKey)}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          forceMount
          className='space-y-4 data-[state=inactive]:hidden'
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
