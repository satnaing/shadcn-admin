"use client"

import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { ThumbsUp, ThumbsDown, CheckCircle2, Clock, MessageSquare, Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { OnboardingCard } from "@/features/onboarding/onboarding-card"
import { OnboardingNavigation } from "@/features/onboarding/onboarding-navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/context/onboarding-context"

// Mock LinkedIn posts with generated comments
const DEMO_POSTS = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      title: "Chief Marketing Officer",
      initials: "SC",
    },
    content:
      "Excited to announce our new product launch! After months of hard work, our team has created something truly innovative that will disrupt the market.",
    likes: 142,
    comments: 28,
    generatedComment:
      "Congratulations on the launch, Sarah! 🎉 Innovation is key in today's rapidly evolving market. I'd be interested to hear more about how your team approached the development process and what customer pain points you're addressing. Looking forward to seeing the impact!",
  },
  {
    id: 2,
    author: {
      name: "Michael Rodriguez",
      title: "Tech Lead at Enterprise Solutions",
      initials: "MR",
    },
    content:
      "Just published my thoughts on the future of AI in enterprise software. The potential for transformation is enormous, but we need to address ethical concerns head-on.",
    likes: 89,
    comments: 15,
    generatedComment:
      "Great insights, Michael! I've been following developments in AI ethics closely, and you're right that proactive approaches are essential. Have you found any particular frameworks or guidelines that have been helpful in navigating these challenges in your work? Would love to connect and discuss further.",
  },
  {
    id: 3,
    author: {
      name: "Priya Patel",
      title: "Startup Founder & CEO",
      initials: "PP",
    },
    content:
      "Fundraising is tough, but we just closed our Series A! Grateful to our amazing team and investors who believe in our vision to transform healthcare accessibility.",
    likes: 231,
    comments: 42,
    generatedComment:
      "Congratulations on securing your Series A, Priya! 🚀 Healthcare accessibility is such a critical area that needs innovation. Would love to hear more about your journey and the challenges you overcame during the fundraising process. Your persistence is inspiring!",
  },
]

export function DemoStep() {
  const navigate = useNavigate()
  const { data, updateData, markStepCompleted } = useOnboarding()
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activePost, setActivePost] = useState<number | null>(null)

  // Use stored value from context
  const autoApprove = data.autoApprove

  const handleLikeDemo = () => {
    setApprovalDialogOpen(true)
  }

  const handleDislikeDemo = () => {
    navigate({ to: "/onboarding/post-settings" })
  }

  const finishOnboarding = () => {
    setLoading(true)
    updateData({ autoApprove })
    markStepCompleted("demo")

    // Mock API call to save preferences
    setTimeout(() => {
      navigate({ to: "/" })
    }, 1500)
  }

  return (
    <div className="space-y-8">
      <OnboardingCard
        title="Demo: Example Posts & Comments"
        description="Here are some LinkedIn posts that match your settings, with AI-generated comments."
      >
        <div className="space-y-6">
          {DEMO_POSTS.map((post, index) => (
            <Card
              key={post.id}
              className={cn(
                "overflow-hidden border shadow-sm transition-all duration-300",
                activePost === index ? "ring-2 ring-primary ring-offset-2" : "hover:shadow-md hover:-translate-y-1",
              )}
              onClick={() => setActivePost(index)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-300 dark:from-blue-900 dark:to-blue-700 flex items-center justify-center">
                    <span className="font-medium text-blue-700 dark:text-blue-300">{post.author.initials}</span>
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium">{post.author.name}</CardTitle>
                    <CardDescription className="text-xs">{post.author.title}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 group">
                    <Heart className="h-3.5 w-3.5 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />{" "}
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> {post.comments}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-blue-50/50 dark:bg-blue-900/10 flex flex-col items-start p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span className="text-xs font-medium">AI Generated</span>
                  </Badge>
                </div>
                <p className="text-sm">{post.generatedComment}</p>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center space-y-4">
          <h3 className="text-lg font-bold">How do you like these comments?</h3>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="lg"
              className="flex items-center gap-2 relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95"
              onClick={handleDislikeDemo}
            >
              <ThumbsDown className="h-5 w-5" />
              Adjust Settings
            </Button>
            <Button
              size="lg"
              className="flex items-center gap-2 relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95 bg-gradient-to-r from-primary to-blue-400"
              onClick={handleLikeDemo}
            >
              <ThumbsUp className="h-5 w-5" />
              Looks Good!
            </Button>
          </div>
        </div>
      </OnboardingCard>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold">Almost done!</DialogTitle>
            <DialogDescription>
              Would you like us to automatically post comments without your approval?
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 py-4">
            <div
              className={cn(
                "flex-1 p-4 border rounded-lg cursor-pointer transition-all duration-300",
                autoApprove
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-primary/5",
              )}
              onClick={() => updateData({ autoApprove: true })}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    autoApprove ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="font-medium">Automatic</span>
              </div>
              <p className="text-sm text-muted-foreground">Post comments automatically without approval</p>
            </div>

            <div
              className={cn(
                "flex-1 p-4 border rounded-lg cursor-pointer transition-all duration-300",
                !autoApprove
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-primary/5",
              )}
              onClick={() => updateData({ autoApprove: false })}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    !autoApprove ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  )}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <span className="font-medium">Manual Review</span>
              </div>
              <p className="text-sm text-muted-foreground">Review and approve comments before posting</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialogOpen(false)}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95"
            >
              Cancel
            </Button>
            <Button
              onClick={finishOnboarding}
              disabled={loading}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95 bg-gradient-to-r from-primary to-blue-400"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving preferences...
                </>
              ) : (
                "Finish Setup"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <OnboardingNavigation prevStep="/onboarding/comment-settings" />
    </div>
  )
}
