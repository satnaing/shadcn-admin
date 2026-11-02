import type { ReactNode } from 'react'
import { ColorPicker } from '@/components/color-picker'
import { DevRoleSwitcher } from '@/components/dev-role-switcher'
import { Header } from '@/components/layout/header'
import { LocaleSwitcher } from '@/components/locale-switcher'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

interface AdminHeaderProps {
  beforeProfile?: ReactNode
  showLocaleSwitcher?: boolean
}

export function AdminHeader({
  beforeProfile,
  showLocaleSwitcher = true,
}: AdminHeaderProps) {
  return (
    <Header fixed className='border-b'>
      <Search />
      <div className='ms-auto flex items-center space-x-4'>
        {import.meta.env.DEV ? <DevRoleSwitcher /> : null}
        {showLocaleSwitcher ? <LocaleSwitcher /> : null}
        <ColorPicker />
        <ThemeSwitch />
        {beforeProfile}
        <ProfileDropdown />
      </div>
    </Header>
  )
}
