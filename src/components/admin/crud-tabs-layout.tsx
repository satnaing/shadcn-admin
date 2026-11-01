import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface CrudTabItem {
  value: string
  label: string
  icon: ReactNode
}

interface CrudTabsLayoutProps {
  activeTab?: string
  defaultTab?: string
  tabs: CrudTabItem[]
  onTabChange: (value: string) => void
  children: ReactNode
}

export function CrudTabsLayout({
  activeTab,
  defaultTab,
  tabs,
  onTabChange,
  children,
}: CrudTabsLayoutProps) {
  return (
    <Card>
      <CardContent>
        <Tabs
          orientation='vertical'
          value={activeTab}
          defaultValue={defaultTab}
          className='space-y-4'
          onValueChange={onTabChange}
        >
          {/* One tab is not a choice — show the bar only when there is one. */}
          {tabs.length > 1 ? (
            <div className='w-full overflow-x-auto pb-2'>
              <TabsList className='h-10 rounded-md p-1'>
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='rounded-sm! px-3 py-1.5 data-[state=active]:shadow-sm'
                  >
                    {tab.icon}
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          ) : null}
          {children}
        </Tabs>
      </CardContent>
    </Card>
  )
}
