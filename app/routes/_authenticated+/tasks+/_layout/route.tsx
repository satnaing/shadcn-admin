import { Outlet } from 'react-router'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ProfileDropdown } from '~/components/profile-dropdown'
import { Search } from '~/components/search'
import { ThemeSwitch } from '~/components/theme-switch'
import { useBreadcrumbs } from './hooks/use-breadcrumbs'

export const handle = {
  breadcrumb: () => ({ label: 'Tasks', to: '/tasks' }),
}

export default function Tasks() {
  const { Breadcrumbs } = useBreadcrumbs()

  return (
    <>
      <Header>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Breadcrumbs />

      <Main>
        <Outlet />
      </Main>
    </>
  )
}
