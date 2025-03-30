import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/companies-columns'
import { UsersDialogs } from './components/companies-dialogs'
import { UsersPrimaryButtons } from './components/companies-primary-buttons'
import { CompaniesTable } from './components/companies-table'
import UsersProvider from './context/companies-context'
import { companyListSchema } from './data/schema'
import supabase from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { z } from 'zod'

export default function Users() {
  const [companyList, setCompanyList] = useState<z.infer<typeof companyListSchema>>([]);

  useEffect(() => {
    const getCompanies = async () => {
      const { data, error } = await supabase
        .schema('enum')
        .from('companies')
        .select('*');
      
      if (error) {
        console.error('Error fetching companies:', error);
        return;
      }
      
      setCompanyList(data || []);
      console.log('Companies data:', data);
    };
    
    getCompanies();
  },[]);

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
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>회사 목록</h2>
            <p className='text-muted-foreground'>
              부산소마고 학생들이 취업/현장실습한 회사들의 목록입니다.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <CompaniesTable data={companyList} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
