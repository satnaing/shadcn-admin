import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useThemeT } from '../hooks/useThemeT'

export function FormSection({ titleKey, children }: { titleKey: string; children: ReactNode }) {
  const t = useThemeT()

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>{t(titleKey)}</CardTitle>
      </CardHeader>
      <CardContent className='grid gap-4 sm:grid-cols-2'>{children}</CardContent>
    </Card>
  )
}
