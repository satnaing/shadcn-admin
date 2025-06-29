"use client"

import { useState, useEffect } from "react"
import { Edit3, Sparkles, MessageCircle, Users, TrendingUp, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const NOTIFICATION_DATA = [
  {
    icon: Edit3,
    title: "Make it yours: Edit any element with familiar tools",
    subtitle: "Click any text, image, or object to edit directly - just like in PowerPoint or Google Slides.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Comments: Generate engaging responses instantly",
    subtitle: "Our AI analyzes post context and creates authentic, professional comments that drive engagement.",
  },
  {
    icon: MessageCircle,
    title: "Smart Engagement: Boost your LinkedIn presence",
    subtitle: "Automatically generate thoughtful comments that spark meaningful conversations with your network.",
  },
  {
    icon: Users,
    title: "Professional Networking: Connect with purpose",
    subtitle: "Build stronger relationships with personalized, context-aware interactions across your feed.",
  },
  {
    icon: TrendingUp,
    title: "Analytics Dashboard: Track your engagement growth",
    subtitle: "Monitor comment performance, engagement rates, and network growth with detailed insights.",
  },
  {
    icon: Zap,
    title: "Lightning Fast: Generate comments in seconds",
    subtitle: "Save hours of time with instant, high-quality comment generation powered by advanced AI.",
  },
]

export default function RotatingNotification() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [textVisible, setTextVisible] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showNotification, setShowNotification] = useState(true)

  // Calculate progress based on current step
  const progress = ((currentIndex + 1) / NOTIFICATION_DATA.length) * 100

  useEffect(() => {
    const interval = setInterval(() => {
      // Check if we've reached the last notification
      if (currentIndex === NOTIFICATION_DATA.length - 1) {
        setIsCompleted(true)
        // Hide the notification after a brief delay
        setTimeout(() => {
          setShowNotification(false)
        }, 1000)
        return
      }

      // Fade out text
      setTextVisible(false)

      setTimeout(() => {
        // Move to next notification
        setCurrentIndex((prev) => prev + 1)

        // Fade in new text
        setTimeout(() => {
          setTextVisible(true)
        }, 100)
      }, 300)
    }, 3000) // Changed to 3 seconds

    return () => clearInterval(interval)
  }, [currentIndex])

  const currentNotification = NOTIFICATION_DATA[currentIndex]
  const IconComponent = currentNotification.icon

  // Don't render if notification should be hidden
  if (!showNotification) {
    return null
  }

  return (
    <>
      {/* Background Blur Overlay - stays until completed */}
      {!isCompleted && (
        <div className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40 transition-all duration-300" />
      )}

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-full mx-4">
        <Card
          className={cn(
            "rounded-3xl shadow-lg border border-border bg-card transition-all duration-500",
            isCompleted && "opacity-0 translate-y-4",
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div
                  className={cn(
                    "w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-sm transition-opacity duration-300",
                    textVisible ? "opacity-100" : "opacity-60",
                  )}
                >
                  <IconComponent className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <CardTitle
                  className={cn(
                    "text-base font-bold text-foreground leading-tight transition-opacity duration-300",
                    textVisible ? "opacity-100" : "opacity-0",
                  )}
                >
                  {currentNotification.title}
                </CardTitle>
                <CardDescription
                  className={cn(
                    "text-xs text-muted-foreground leading-relaxed transition-opacity duration-300 delay-75",
                    textVisible ? "opacity-100" : "opacity-0",
                  )}
                >
                  {currentNotification.subtitle}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{
                    width: `${progress}%`,
                    backgroundImage:
                      "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s infinite",
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
