import { type ReactNode } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  type NavCollapsible,
  type NavGroup as NavGroupProps,
  type NavItem,
  type NavLink,
} from './types'

export function NavGroup({ title, items }: NavGroupProps) {
  const { t } = useTranslation('sidebar')

  const { state, isMobile } = useSidebar()
  const href = useLocation({ select: (location) => location.href })

  return (
    <SidebarGroup>
      <SidebarGroupLabel className='text-xs font-medium text-muted-foreground'>
        {t(title)}
      </SidebarGroupLabel>
      <SidebarMenu className='gap-1'>
        {items.map((item) => {
          const key = `${item.key}-${item.url}`

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} href={href} t={t} />

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown
                key={key}
                item={item}
                href={href}
                t={t}
              />
            )

          return (
            <SidebarMenuCollapsible key={key} item={item} href={href} t={t} />
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: { children: ReactNode }) {
  return <Badge className='rounded-full px-1 py-0 text-xs'>{children}</Badge>
}

function navLinkClassName(isActive: boolean) {
  return cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-xs font-medium transition-colors',
    isActive
      ? 'bg-primary/10 font-semibold text-primary'
      : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
  )
}

function SidebarMenuLink({
  item,
  href,
  t,
}: {
  item: NavLink
  href: string
  t: (key: string) => string
}) {
  const { setOpenMobile } = useSidebar()
  const isActive = checkIsActive(href, item)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        variant='nav'
        size='nav'
        isActive={isActive}
        tooltip={t(item.title)}
      >
        <Link to={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{t(item.title)}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({
  item,
  href,
  t,
}: {
  item: NavCollapsible
  href: string
  t: (key: string) => string
}) {
  const { setOpenMobile } = useSidebar()
  const isParentActive = checkIsActive(href, item, true)

  return (
    <Collapsible
      asChild
      defaultOpen={isParentActive}
      className='group/collapsible'
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            variant='navParent'
            size='nav'
            isActive={isParentActive}
            tooltip={t(item.title)}
          >
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronDown className='ms-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-180' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub className='mx-0 ms-6 mt-1 gap-1 border-s border-sidebar-border px-0 ps-3'>
            {item.items.map((subItem) => {
              const isSubActive = checkIsActive(href, subItem)

              return (
                <SidebarMenuSubItem key={subItem.key}>
                  <SidebarMenuSubButton
                    asChild
                    variant='nav'
                    isActive={isSubActive}
                  >
                    <Link to={subItem.url} onClick={() => setOpenMobile(false)}>
                      {subItem.icon && <subItem.icon />}
                      <span>{t(subItem.title)}</span>
                      {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({
  item,
  href,
  t,
}: {
  item: NavCollapsible
  href: string
  t: (key: string) => string
}) {
  const isParentActive = checkIsActive(href, item, true)

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            variant='nav'
            size='nav'
            isActive={isParentActive}
            tooltip={t(item.title)}
          >
            {item.icon && <item.icon />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => {
            const isSubActive = checkIsActive(href, sub)

            return (
              <DropdownMenuItem key={`${sub.key}-${sub.url}`} asChild>
                <Link to={sub.url} className={navLinkClassName(isSubActive)}>
                  {sub.icon && <sub.icon />}
                  <span className='max-w-52 text-wrap'>{t(sub.title)}</span>
                  {sub.badge && (
                    <span className='ms-auto text-xs'>{sub.badge}</span>
                  )}
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

function checkIsActive(href: string, item: NavItem, mainNav = false) {
  const pathname = href.split('?')[0]

  return (
    pathname === item.url ||
    pathname.startsWith(`${item.url}/`) ||
    !!item?.items?.some(
      (child) => pathname === child.url || pathname.startsWith(`${child.url}/`)
    ) ||
    (mainNav &&
      pathname.split('/')[1] !== '' &&
      pathname.split('/')[1] === item?.url?.split('/')[1])
  )
}
