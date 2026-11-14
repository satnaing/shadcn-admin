import { Link } from '@tanstack/react-router'
import { type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface DashboardNavCardProps {
  title: string
  description: string
  icon: LucideIcon
  url: string
  iconColor?: string
  iconBg?: string
  badge?: string
}

export function DashboardNavCard({
  title,
  description,
  icon: Icon,
  url,
  iconColor = 'text-blue-600 dark:text-blue-400',
  iconBg = 'bg-blue-50 dark:bg-blue-950/60',
  badge,
}: DashboardNavCardProps) {
  return (
    <Link to={url} className="group block h-full">
      <div className="flex h-full items-center gap-4 rounded-xl border bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-transparent shadow-xs transition-transform duration-200 group-hover:scale-105',
            iconBg,
            iconColor
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary truncate">
              {title}
            </h3>
            {badge && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                {badge}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}
