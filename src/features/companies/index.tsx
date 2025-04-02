import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import Loader from '@/components/loader'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/companies-columns'
import { CompaniesDialogs } from './components/companies-dialogs'
import { CompaniesPrimaryButtons } from './components/companies-primary-buttons'
import { CompaniesTable } from './components/companies-table'
import UsersProvider from './context/companies-context'
import { useCompanyListQuery } from './services/selectCompanyList'

export default function Companies() {
  const { data, isLoading } = useCompanyListQuery()
  if (isLoading) return <Loader />

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='flex items-center ml-auto space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='flex flex-wrap items-center justify-between mb-2 space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>회사 목록</h2>
            <p className='text-muted-foreground'>
              부산소마고 학생들이 취업/현장실습한 회사들의 목록입니다.
            </p>
          </div>
          <CompaniesPrimaryButtons />
        </div>
        <div className='flex-1 px-4 py-1 -mx-4 overflow-auto lg:flex-row lg:space-x-12 lg:space-y-0'>
          <CompaniesTable data={data ?? []} columns={columns} />
        </div>
      </Main>

      <CompaniesDialogs />
    </UsersProvider>
  )
}
