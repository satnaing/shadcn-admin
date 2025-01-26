import { IconMenu } from '@tabler/icons-react'
import { NavLink } from 'react-router'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string
    href: string
    disabled?: boolean
  }[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <>
      <div className="md:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <IconMenu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            {links.map(({ title, href }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                <NavLink
                  to={href}
                  className="text-muted-foreground aria-[current=page]:text-foreground"
                >
                  {title}
                </NavLink>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden items-center space-x-4 md:flex lg:space-x-6',
          className,
        )}
        {...props}
      >
        {links.map(({ title, href }) => (
          <NavLink
            key={`${title}-${href}`}
            to={href}
            className={
              '0 text-muted-foreground hover:text-primary aria-[current=page]:text-foreground text-sm font-medium transition-colors'
            }
          >
            {title}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
