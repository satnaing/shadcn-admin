import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string
    href: string
    isActive: boolean
  }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      {links.map(({ title, href, isActive }) => (
        <Link
          to={href}
          className={`text-sm font-medium transition-colors hover:text-primary ${isActive ? '' : 'text-muted-foreground'}`}
        >
          {title}
        </Link>
      ))}
    </nav>
  )
}
