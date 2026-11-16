import type { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LOCALES, type Locale } from '../data/preorder.type'

/** One tab per UI language (az is the default one, first); the module stores all four translations. */
export function PreorderLocaleTabs({
  children,
}: {
  children: (locale: Locale) => ReactNode
}) {
  return (
    <Tabs defaultValue={LOCALES[0]} className='space-y-3'>
      <TabsList>
        {LOCALES.map((l) => (
          <TabsTrigger key={l} value={l} className='uppercase'>
            {l}
          </TabsTrigger>
        ))}
      </TabsList>
      {LOCALES.map((l) => (
        <TabsContent
          key={l}
          value={l}
          forceMount
          className='space-y-3 data-[state=inactive]:hidden'
        >
          {children(l)}
        </TabsContent>
      ))}
    </Tabs>
  )
}
