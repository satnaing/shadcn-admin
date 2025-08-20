 
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UPISearch } from './components/search'
import { UPIAnalyticsTable, UPIAnalytics } from './components/table'
import { Separator } from '@/components/ui/separator'
import { upiColumns } from './components/columns'
import { UPIAnalyticsTablePagination } from './components/pagination'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const getToken = () => {
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ''
}

interface UPISearchFields {
  report_type?: string
}

export default function Upi_Analytics() {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10
  const [searchParams, setSearchParams] = useState<UPISearchFields | null>(null)

  // Build query params for API
  const buildQueryParams = (): Record<string | number, string | number > => {
    const params: Record<string | number, string | number > = {
      page: pageIndex + 1,
      limit: pageSize,
    }
    if (searchParams) {
      if (searchParams.report_type) params.report_type = searchParams.report_type
       
    }
    return params
  }

  const fetchUPITransactions = async (): Promise<UPIAnalytics[]> => {
    const token = getToken();
    const params = buildQueryParams();
    const response = await axios.post(
      `${BACKEND_BASE_URL}/v1/upi/getAnalyticsReport`,
      params, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    if (response.data?.reports) {
      //console.log(response.data?.reports || [])
      return response.data?.reports || [];
    }
    return [];

    
  
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['upi-transactions', pageIndex, pageSize, searchParams],
    queryFn: fetchUPITransactions,
    // removed enabled so it fetches on page load
  })



  //console.log(data)

  // Defensive mapping
  const mappedData: UPIAnalytics[] = (data || []).map((item : any) => {
    const span = item.span || ""
    const t = item.data || {}
    return {
      span: span,
      unique_users_onboarded: Number(t.unique_users_onboarded?? ''),
      users_linked_bank_account: Number(t.users_linked_bank_account ?? ''),
      unique_bank_account: Number(t.unique_bank_account ?? ''),
      users_linked_rupay_creditcard: Number(t.users_linked_rupay_creditcard ?? ''),
      users_linked_credit_line: Number(t.users_linked_credit_line ?? ''),
      upi_lite_setup_users: Number(t.upi_lite_setup_users ?? ''),
      users_setup_auto_pay: Number(t.users_setup_auto_pay ?? '')
      
    }
  })

  // Search handler
  const handleSearch = (fields: UPISearchFields) => {
    setSearchParams(fields)
    setPageIndex(0) // Reset to first page on new search
  }

  // Reset handler
  const handleReset = () => {
    setSearchParams(null)
    setPageIndex(0)
  }

  // Error handler
  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError(err)) {
      if (err.response?.data?.error) {
        return err.response.data.error;
      }
      if (err.response?.data?.message) {
        return err.response.data.message;
      }
      return err.message;
    }
    if (err instanceof Error) {
      return err.message
    }
    return 'An unknown error occurred';
  }

  let unit = "on Daily basis "
  if(searchParams?.report_type==="daily" ){
    unit = " on Daily basis"
  }else if(searchParams?.report_type==="weekly"){
    unit = " on Weekly basis"
  }else if(searchParams?.report_type==="monthly"){
    unit = " on Monthly basis"
  }

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
              UPI Transactions Analytics Report
            </h2>
            <p className='text-muted-foreground'>
              Search and view UPI transactions analytics with detailed filters.
            </p>
          </div>
        </div>
        <UPISearch onSearch={handleSearch} onReset={handleReset} />
        <Separator className='shadow-sm mt-4' />
        <div className='my-4 flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Report for Analytics {unit}
          </h2>
        </div><div className='my-4 flex items-center justify-between'>
          <h3 className='text-sm font-semibold tracking-tight'>
            (Reports are arranged in Descending order, from the most recent to the oldest we go)
          </h3>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {isLoading ? (
            <div>Loading transactions...</div>
          ) : isError ? (
            <div className="text-red-500">Error: {getErrorMessage(error)}</div>
          ) : (
            <>
              <UPIAnalyticsTable data={mappedData} columns={upiColumns} />
              <UPIAnalyticsTablePagination
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                hasNextPage={mappedData.length === pageSize}
              />
            </>
          )}
        </div>
      </Main>
    </div>
  )
}

 
