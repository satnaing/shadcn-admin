"use client"

import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Clock,
  Loader2,
  MoreHorizontal,
  Sparkles,
  MessageCircle,
  Share,
  Heart,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useOnboarding } from "@/context/onboarding-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import RotatingNotification from "../rotating-notification"

const DEMO_POSTS = [
  {
    id: 1,
    author: {
      name: "Sarah Chen",
      title: "Chief Marketing Officer",
      company: "TechCorp Inc.",
      initials: "SC",
    },
    content:
      "Excited to announce our new product launch! 🚀 After months of hard work, our team has created something truly innovative that will disrupt the market.",
    generatedComment:
      "Congratulations on the launch, Sarah! 🎉 Innovation is key in today's rapidly evolving market. I'd be interested to hear more about how your team approached the development process. Looking forward to seeing the impact!",
  },
  {
    id: 2,
    author: {
      name: "Michael Rodriguez",
      title: "Tech Lead",
      company: "Enterprise Solutions",
      initials: "MR",
    },
    content:
      "Just published my thoughts on the future of AI in enterprise software. 🤖 The potential for transformation is enormous, but we need to address ethical concerns head-on.",
    generatedComment:
      "Great insights, Michael! I've been following developments in AI ethics closely, and you're absolutely right that proactive approaches are essential. Would love to connect and discuss this further.",
  },
  {
    id: 3,
    author: {
      name: "Priya Patel",
      title: "Startup Founder & CEO",
      company: "HealthTech Innovations",
      initials: "PP",
    },
    content:
      "Fundraising is tough, but we just closed our Series A! 💪 Grateful to our amazing team and investors who believe in our vision to transform healthcare accessibility.",
    generatedComment:
      "Congratulations on securing your Series A, Priya! 🚀 Healthcare accessibility is such a critical area that needs innovation. Your dedication to this mission is truly inspiring!",
  },
]

export function DemoStep() {
  // ... (keep all the same state and handler functions)

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
    <div className="space-y-8 mt-10">
      {/* Header Section */}
      <div className="-mt-10 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Comments</span>
        </div>

        <h2 className="text-4xl font-bold tracking-tight">
          See AI Comments in Action
        </h2>

        <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
          Here are examples of AI-generated comments that match your professional tone. Each comment is personalized and
          engaging to help you build meaningful connections.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {DEMO_POSTS.map((post, index) => (
          <div
            key={post.id}
            className={cn(
              "group overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md",
              activePost === index ? "ring-2 ring-secondary" : ""
            )}
            onClick={() => setActivePost(activePost === index ? null : index)}
          >
            {/* LinkedIn Post Section */}
            <div className="border-b">
              {/* Post Header */}
              <div className="flex flex-col space-y-6 p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <span className="text-sm font-bold">{post.author.initials}</span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold">{post.author.name}</h3>
                      <p className="truncate text-sm text-muted-foreground">{post.author.title}</p>
<p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
  2h • <Globe className="w-3 h-3" />
</p>                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6 pb-4">
                <p className="text-sm">{post.content}</p>
              </div>

              {/* Post Actions */}
              <div className="flex flex-col items-stretch justify-between p-6 pt-2 pb-4">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400">
                        <ThumbsUp className="h-3 w-3 text-primary-foreground" />
                      </div>
                      <div className="-ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive">
                        <Heart className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <span className="ml-1 text-xs text-muted-foreground">24 reactions</span>
                  </div>
                  <span className="text-xs text-muted-foreground">5 comments</span>
                </div>
                <div className="mt-3 flex items-center justify-around border-t pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-xs">Like</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">Comment</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Share className="h-4 w-4" />
                    <span className="text-xs">Share</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Comment Section */}
            <div className="bg-muted/50">
              {/* AI Comment Header */}
              <div className="flex flex-col space-y-6 p-6 pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary">
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    AI Comment
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                      <span className="text-xs text-muted-foreground">Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Comment Content */}
              <div className="p-6 pb-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <span className="text-xs font-bold">AI</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-lg border bg-background p-3">
                      <p className="text-xs">
                        {post.generatedComment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Comment Footer */}
              <div className="flex flex-col items-stretch justify-between p-6 pt-2">
                <div className="flex w-full items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                  Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                  >
                  Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 rounded-lg border bg-muted/50 p-8 text-center">
        <h3 className="mb-2 text-xl font-bold">How do these AI-generated comments look?</h3>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
          Our AI creates personalized, professional comments that match your tone and style. Click on any card above to
          see more details.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleDislikeDemo}
          >
            <ThumbsDown className="h-5 w-5" />
            Adjust Settings
          </Button>
          <Button
            size="lg"
            onClick={handleLikeDemo}
          >
            <ThumbsUp className="h-5 w-5" />
            Looks Perfect!
          </Button>
        </div>
      </div>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Almost done!</DialogTitle>
            <DialogDescription>
              Would you like us to automatically post comments without your approval?
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 py-4">
            <div
              className={cn(
                "flex-1 cursor-pointer rounded-lg border p-4",
                autoApprove ? "border-primary bg-primary/5" : "border-border"
              )}
              onClick={() => updateData({ autoApprove: true })}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    autoApprove ? "bg-primary text-primary-foreground" : "bg-muted"
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
                "flex-1 cursor-pointer rounded-lg border p-4",
                !autoApprove ? "border-primary bg-primary/5" : "border-border"
              )}
              onClick={() => updateData({ autoApprove: false })}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    !autoApprove ? "bg-primary text-primary-foreground" : "bg-muted"
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
            >
              Cancel
            </Button>
            <Button
              onClick={finishOnboarding}
              disabled={loading}
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
      <RotatingNotification />
    </div>
  )
}