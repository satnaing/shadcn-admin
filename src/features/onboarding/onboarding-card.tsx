import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface OnboardingCardProps {
  title: ReactNode
  description?: string
  children: ReactNode
  className?: string
}

export function OnboardingCard({
  title,
  description,
  children,
  className,
}: OnboardingCardProps) {
  return (
    <Card
      className={`mx-auto w-full max-w-2xl rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${className}`}
    >
      {/* Header Section */}
      <CardHeader className='px-0'>
        <CardTitle className='text-foreground text-3xl font-bold'>
          {title}
        </CardTitle>
        {description && (
          <CardDescription className='text-muted-foreground mt-1 text-base'>
            {description}
          </CardDescription>
        )}
      </CardHeader>

      {/* Body Section */}
      <CardContent className='px-0 pt-2'>{children}</CardContent>
    </Card>
  )
}
