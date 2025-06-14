import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
// import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { useUserListQuery } from './services/seleteUserList'
import Loader from '@/components/loader'

export default function Users() {
  const { data, isLoading } = useUserListQuery()
  if (isLoading) return <Loader />

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>


      <Main>
        <div className="mb-2">
          <h2 className="text-2xl font-bold tracking-tight">학생 목록</h2>
          <p className="text-muted-foreground">
            부산소프트웨어마이스터고 학생들을 관리할 수 있는 페이지입니다.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1">
            <UsersTable data={data ?? []} columns={columns} />
          </div>

          <UsersDialogs />
        </div>
      </Main>
    </UsersProvider>
  )
}