"use client"

import { useState, useEffect } from "react"
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
import { AutoDismissSuccessModal } from "../auto-dismisal"

// Mock LinkedIn posts with generated comments
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

  const [showSuccess, setShowSuccess] = useState(false)

  // Auto-show the modal when component mounts
  useEffect(() => {
    setShowSuccess(true)
  }, [])

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <div className="p-6">{showSuccess && <AutoDismissSuccessModal />}</div>
      </div>

      {/* Header Section */}
      <div className="-mt-10 space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Comments</span>
        </div>

        <h2 className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-bold font-clash text-transparent">
          See AI Comments in Action
        </h2>

        <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Here are examples of AI-generated comments that match your professional tone. Each comment is personalized and
          engaging to help you build meaningful connections.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 gap-8 p-6 md:grid-cols-2 lg:grid-cols-3">
        {DEMO_POSTS.map((post, index) => (
          <div
            key={post.id}
            className={cn(
              "group cursor-pointer overflow-hidden rounded-lg border bg-card shadow-lg backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl",
              "bg-gradient-to-br from-card via-card to-muted/30",
              activePost === index
                ? "scale-[1.02] bg-gradient-to-br from-primary/5 to-card shadow-2xl ring-2 ring-primary ring-offset-4"
                : "hover:bg-gradient-to-br hover:from-muted/50 hover:to-card",
            )}
            onClick={() => setActivePost(activePost === index ? null : index)}
          >
            {/* LinkedIn Post Section */}
            <div className="relative border-b border-border">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              {/* Post Header */}
              <div className="flex flex-col space-y-6 p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg ring-2 ring-primary/20">
                        <span className="text-sm font-bold text-primary-foreground">{post.author.initials}</span>
                      </div>
                      <div className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-card bg-primary shadow-sm"></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-card-foreground">{post.author.name}</h3>
                      <p className="truncate text-sm font-medium text-muted-foreground">{post.author.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">2h • 🌐</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6 pb-4">
                <p className="line-clamp-4 text-sm leading-relaxed font-medium text-card-foreground">{post.content}</p>
              </div>

              {/* Post Actions */}
              <div className="flex flex-col items-stretch justify-between p-6 pt-2 pb-4">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
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
                <div className="mt-3 flex items-center justify-around border-t border-border pt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-xs font-medium">Like</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs font-medium">Comment</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  >
                    <Share className="h-4 w-4" />
                    <span className="text-xs font-medium">Share</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Comment Section */}
            <div className="relative bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

              {/* AI Comment Header */}
              <div className="flex flex-col space-y-6 p-6 pb-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary text-primary-foreground text-xs font-medium shadow-md hover:bg-primary/90">
                    <Sparkles className="mr-1.5 h-3 w-3" />
                    AI Comment
                  </Badge>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
                      <span className="text-xs font-medium text-muted-foreground">Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Comment Content */}
              <div className="p-6 pb-3">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 shadow-md ring-2 ring-primary/20">
                      <span className="text-xs font-bold text-primary-foreground">AI</span>
                    </div>
                    <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-card bg-primary shadow-sm"></div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="rounded-lg border border-border bg-card/60 p-3 shadow-sm backdrop-blur-sm">
                      <p className="line-clamp-4 text-xs leading-relaxed font-medium text-card-foreground">
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
                    className="h-8 flex-1 border-border text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 flex-1 bg-primary text-primary-foreground text-xs font-medium shadow-md transition-all duration-200 hover:bg-primary/90 hover:shadow-lg"
                  >
                    🚀 Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <div className="mt-12 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 p-8 text-center">
        <h3 className="mb-2 text-xl font-bold font-clash text-foreground">How do these AI-generated comments look?</h3>
        <p className="mx-auto mb-6 max-w-2xl text-muted-foreground">
          Our AI creates personalized, professional comments that match your tone and style. Click on any card above to
          see more details.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            className="relative flex items-center gap-2 overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95 bg-card border-border text-card-foreground hover:bg-accent hover:text-accent-foreground"
            onClick={handleDislikeDemo}
          >
            <ThumbsDown className="h-5 w-5" />
            Adjust Settings
          </Button>
          <Button
            size="lg"
            className="relative flex items-center gap-2 overflow-hidden bg-primary text-primary-foreground transition-all duration-300 hover:shadow-md active:scale-95 hover:bg-primary/90"
            onClick={handleLikeDemo}
          >
            <ThumbsUp className="h-5 w-5" />
            Looks Perfect!
          </Button>
        </div>
      </div>

      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="sm:max-w-md bg-popover border-border">
          <DialogHeader>
            <DialogTitle className="font-bold font-clash text-popover-foreground">Almost done!</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Would you like us to automatically post comments without your approval?
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 py-4">
            <div
              className={cn(
                "flex-1 cursor-pointer rounded-lg border p-4 transition-all duration-300",
                autoApprove
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-primary/5",
              )}
              onClick={() => updateData({ autoApprove: true })}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    autoApprove ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  )}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span className="font-medium text-popover-foreground">Automatic</span>
              </div>
              <p className="text-muted-foreground text-sm">Post comments automatically without approval</p>
            </div>

            <div
              className={cn(
                "flex-1 cursor-pointer rounded-lg border p-4 transition-all duration-300",
                !autoApprove
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border hover:border-primary/30 hover:bg-primary/5",
              )}
              onClick={() => updateData({ autoApprove: false })}
            >
              <div className="mb-2 flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full",
                    !autoApprove ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  )}
                >
                  <Clock className="h-4 w-4" />
                </div>
                <span className="font-medium text-popover-foreground">Manual Review</span>
              </div>
              <p className="text-muted-foreground text-sm">Review and approve comments before posting</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApprovalDialogOpen(false)}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-md active:scale-95 bg-card border-border text-card-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={finishOnboarding}
              disabled={loading}
              className="relative overflow-hidden bg-primary text-primary-foreground transition-all duration-300 hover:shadow-md active:scale-95 hover:bg-primary/90"
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
    </div>
  )
}
