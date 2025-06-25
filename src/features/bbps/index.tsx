// import React from "react";
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TransactionSearch } from './components/transaction-search'
import { TransactionsTable } from './components/transactions-table'
import { Separator } from '@/components/ui/separator'
import { bbpsColumns } from './components/bbps-columns'
import { bbpsTransactions } from './data/bbps-transactions'

// ...
//import { columns } from './components/columns'

export default function BBPS() {
  return (
    <div>
      <Header>
        <Search />
        <div className='ml-auto flex items-center gap-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main> 
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              BBPS Transaction Panel
            </h2>
            <p className='text-muted-foreground'>
              Search and view bill payment transactions with detailed filters.
            </p>
          </div>
        </div>
        {/* Add your BBPS components here */}
        <TransactionSearch onSearch={() => {}} onReset={() => {}} />
        <Separator className='shadow-sm mt-4' />
        <div className='my-4'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Transaction Results
          </h2>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <TransactionsTable data={bbpsTransactions} columns={bbpsColumns} />
        </div>
      </Main>
    </div>
  )
}
