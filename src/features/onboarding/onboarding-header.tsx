import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeSwitch } from "@/components/theme-switch"

export function OnboardingHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">



          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-500  shadow-md">
            <span className="text-sm font-bold text-primary-foreground font-clash">C</span>
          </div>


          <span className="text-xl font-bold font-clash text-foreground">Commentify</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="group text-sm text-muted-foreground hover:text-foreground">
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
