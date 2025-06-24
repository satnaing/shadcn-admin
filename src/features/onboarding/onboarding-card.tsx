import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OnboardingCardProps {
  title: ReactNode
  description?: string
  children: ReactNode
  className?: string
}

export function OnboardingCard({ title, description, children, className }: OnboardingCardProps) {
  return (
    <Card
      className={`w-full max-w-2xl mx-auto rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl ${className}`}
    >
      {/* Header Section */}
      <CardHeader className="px-0">
        <CardTitle className="text-3xl font-bold text-foreground">{title}</CardTitle>
        {description && (
          <CardDescription className="text-base text-muted-foreground mt-1">{description}</CardDescription>
        )}
      </CardHeader>

      {/* Body Section */}
      <CardContent className="px-0 pt-2">{children}</CardContent>
    </Card>
  )
}
