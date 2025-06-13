import { Link } from "@tanstack/react-router"
import { MessageSquare, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSwitch } from "@/components/theme-switch"

export function OnboardingHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold">Commentify</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-sm group">
              Skip to dashboard
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
          <ThemeSwitch />
        </div>
      </div>
    </header>
  )
}
