import type { ReactNode } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface AdminCardShellProps {
  children: ReactNode
}

export function AdminCardShell({ children }: AdminCardShellProps) {
  return (
    <Card>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
