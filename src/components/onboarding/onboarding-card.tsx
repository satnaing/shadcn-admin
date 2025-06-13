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
      className={`w-full border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${className}`}
    >
      <div className="h-1 bg-gradient-to-r from-primary to-blue-400" />
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {description && <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
