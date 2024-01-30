import { Link } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from './ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { IconChevronDown } from '@tabler/icons-react'
import { SideLink } from '@/data/sidelinks'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NavProps {
  isCollapsed: boolean
  links: SideLink[]
}

export default function Nav({ links, isCollapsed }: NavProps) {
  const renderLink = ({ sub, ...rest }: SideLink) => {
    const key = `${rest.title}-${rest.href}`
    if (isCollapsed && sub)
      return <NavLinkIconDropdown {...rest} sub={sub} key={key} />

    if (isCollapsed) return <NavLinkIcon {...rest} key={key} />

    if (sub) return <NavLinkDropdown {...rest} sub={sub} key={key} />

    return <NavLink {...rest} key={key} />
  }
  return (
    <div
      data-collapsed={isCollapsed}
      className='group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2'
    >
      <nav className='grid gap-1 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2'>
        {links.map(renderLink)}
      </nav>
    </div>
  )
}

interface NavLinkProps extends SideLink {
  subLink?: boolean
}

function NavLink({
  title,
  isActive,
  icon,
  label,
  href,
  subLink = false,
}: NavLinkProps) {
  return (
    <Link
      to={href}
      className={cn(
        buttonVariants({
          variant: isActive ? 'secondary' : 'ghost',
          size: 'sm',
        }),
        'justify-start px-6 h-12 rounded-none',
        subLink && 'border-l border-l-slate-500 w-full h-10'
      )}
    >
      <div className='mr-2'>{icon}</div>
      {title}
      {label && (
        <div className='ml-2 bg-primary text-primary-foreground px-1 rounded-lg text-[0.625rem]'>
          {label}
        </div>
      )}
    </Link>
  )
}

function NavLinkDropdown({ title, icon, label, sub }: SideLink) {
  return (
    <Collapsible>
      <CollapsibleTrigger
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'justify-start px-6 h-12 rounded-none w-full group'
        )}
      >
        <div className='mr-2'>{icon}</div>
        {title}
        {label && (
          <div className='ml-2 bg-primary text-primary-foreground px-1 rounded-lg text-[0.625rem]'>
            {label}
          </div>
        )}
        <span
          className={cn(
            'ml-auto transition-all group-data-[state="open"]:-rotate-180'
          )}
        >
          <IconChevronDown stroke={1} />
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className='collapsibleDropdown' asChild>
        <ul>
          {sub!.map((sublink) => (
            <li key={sublink.title} className='ml-8 my-1'>
              <NavLink {...sublink} subLink />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}

function NavLinkIcon({ title, isActive, icon, label, href }: NavLinkProps) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link
          to={href}
          className={cn(
            buttonVariants({
              variant: isActive ? 'secondary' : 'ghost',
              size: 'icon',
            }),
            'h-12 w-12'
          )}
        >
          {icon}
          <span className='sr-only'>{title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right' className='flex items-center gap-4'>
        {title}
        {label && (
          <span className='ml-auto text-muted-foreground'>{label}</span>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

function NavLinkIconDropdown({ title, icon, label, sub }: SideLink) {
  return (
    <DropdownMenu>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='icon' className='w-12 h-12'>
              {icon}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side='right' className='flex items-center gap-4'>
          {title}{' '}
          {label && (
            <span className='ml-auto text-muted-foreground'>{label}</span>
          )}
          <IconChevronDown
            size={18}
            className='-rotate-90 text-muted-foreground'
          />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent side='right' align='start' sideOffset={4}>
        <DropdownMenuLabel>
          {title} {label ? `(${label})` : ''}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sub!.map(({ title, icon, label, href }) => (
          <DropdownMenuItem key={title} asChild>
            <Link to={href}>
              {icon} <span className='ml-2'>{title}</span>
              {label && <span className='ml-auto text-xs'>{label}</span>}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
