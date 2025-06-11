import { useTheme } from '@/context/theme-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'

export default function Dashboard() {
  const { theme } = useTheme()
  const grafanaSrc = `/d/degaj6kbosoowe/bsmhubtest?orgId=1&from=now-2y&to=now&timezone=browser&var-join_at_year=$__all&refresh=auto&kiosk&theme=${
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  }`

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main fixed>
        <object
          key={theme}
          type='text/html'
          data-testid='grafana-iframe'
          data={grafanaSrc}
          className='h-full min-h-[600px] w-full rounded-lg bg-background'
        ></object>
      </Main>
    </>
  )
}
