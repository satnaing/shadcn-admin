import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface OnboardingCardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function OnboardingCard({ title, description, children, className }: OnboardingCardProps) {
  return (
    <Card
      className={`w-full max-w-2xl mx-auto bg-card border-border rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
    >
      {/* Header Section */}
      <CardHeader className="px-0">
        <CardTitle className="text-3xl font-bold font-clash text-foreground">{title}</CardTitle>
        {description && (
          <CardDescription className="text-base text-muted-foreground mt-1">{description}</CardDescription>
        )}
      </CardHeader>

      {/* Body Section */}
      <CardContent className="px-0 pt-2">{children}</CardContent>
    </Card>
  )
}
