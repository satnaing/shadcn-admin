import { useLocation } from "@tanstack/react-router"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

const TESTIMONIALS = {
  default: {
    quote:
      "Commentify has transformed how I engage on LinkedIn. The AI-generated comments are thoughtful and have significantly increased my network growth.",
    author: "Michael Chen",
    title: "Marketing Director",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 5,
  },
  extension: {
    quote:
      "The Chrome extension is so easy to use! It took me less than a minute to set up and start automating my LinkedIn engagement.",
    author: "Sarah Johnson",
    title: "Startup Founder",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 5,
  },
  linkedin: {
    quote:
      "The LinkedIn integration is seamless. I was worried about security, but Commentify's authentication process is top-notch and secure.",
    author: "David Rodriguez",
    title: "CTO",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 5,
  },
  "post-settings": {
    quote:
      "Being able to target specific keywords and author titles has helped me connect with the right people in my industry. Game changer!",
    author: "Emily Wong",
    title: "Business Development Manager",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 5,
  },
  "comment-settings": {
    quote:
      "The comment customization options are incredible. My automated comments sound exactly like me - my connections can't tell the difference!",
    author: "Alex Thompson",
    title: "Content Strategist",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 5,
  },
  demo: {
    quote:
      "Seeing the demo comments before committing was what sold me. The quality of AI-generated comments is impressive and has saved me hours each week.",
    author: "Priya Patel",
    title: "Growth Marketing Lead",
    avatar: "/placeholder.svg?height=64&width=64",
    rating: 5,
  },
}

export function OnboardingTestimonials() {
  const location = useLocation()
  const pathname = location.pathname

  // Determine which testimonial to show based on the current path
  const currentStep = pathname.split("/").pop() || "default"
  const testimonial = TESTIMONIALS[currentStep as keyof typeof TESTIMONIALS] || TESTIMONIALS.default

  return (
    <div className="hidden lg:block lg:w-1/3 bg-muted/30 p-8 border-l">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-2">What our users say</h3>
          <p className="text-muted-foreground text-sm">
            Join thousands of professionals who are saving time and growing their network with Commentify
          </p>
        </div>

        <div className="relative p-6 rounded-xl bg-card border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-400 rounded-t-xl" />
          <Quote className="h-8 w-8 text-primary/20 mb-2" />
          <div className="flex mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn("h-4 w-4", i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300")}
              />
            ))}
          </div>
          <blockquote className="text-sm italic mb-6">"{testimonial.quote}"</blockquote>
          <div className="flex items-center">
            <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
              <span className="font-medium text-blue-700 dark:text-blue-300">
                {testimonial.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <p className="font-medium text-sm">{testimonial.author}</p>
              <p className="text-xs text-muted-foreground">{testimonial.title}</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-500 text-xs font-bold">i</span>
            </div>
            <h4 className="font-medium">Pro Tip</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentStep === "extension" && "Install the extension once and use it across all your LinkedIn accounts."}
            {currentStep === "linkedin" &&
              "Ensure you're logged into LinkedIn before connecting for a smoother experience."}
            {currentStep === "post-settings" &&
              "Target industry-specific keywords to find the most relevant posts for engagement."}
            {currentStep === "comment-settings" &&
              "Adding your professional background helps generate more personalized comments."}
            {currentStep === "demo" && "You can always adjust your settings later from your dashboard if needed."}
            {!["extension", "linkedin", "post-settings", "comment-settings", "demo"].includes(currentStep) &&
              "Complete all onboarding steps for the best experience with Commentify."}
          </p>
        </div>
      </div>
    </div>
  )
}
