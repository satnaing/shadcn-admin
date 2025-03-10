import { Header } from '@/components/layout/header'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'

export default function Integration() {
    return (
      <>
      <Header fixed>
              <Search />
              <div className='ml-auto flex items-center space-x-4'>
                <ThemeSwitch />
                <ProfileDropdown />
              </div>
            </Header>

      </>
    )
  }