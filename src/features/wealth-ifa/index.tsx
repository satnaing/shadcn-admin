import { useState } from 'react'
import axios, { isAxiosError } from 'axios'
import { useQuery } from '@tanstack/react-query'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { wealthColumns } from './components/wealth-columns'
import { WealthSearch } from './components/wealth-search'
import { WealthData, WealthTable } from './components/wealth-table'
import { WealthTablePagination } from './components/wealth-table-pagination'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const getToken = () => {
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ''
}
// Map WealthIFAFields[] to WealthData[]

type WealthApiUser = {
  id?: string | number;
  customer_id?: string | number;
  name?: string;
  mobile?: string;
  product?: string;
  pan?: string;
  account_number?: string;
  bank_name?: string;
  ifsc?: string | number;
  email?: string;
  aadhar?: string;
  pan_img_url?: string;
  aadhar_img_url?: string;
  cancelled_cheque_img_url?: string;
  status?: string;
  arn?: string;
  company_name?: string;
};


export default function WealthIFA() {
  const [searchParams, setSearchParams] = useState<{
    customerId: string;
    mobile: string;
    pan: string;
    email: string;
  } | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10

  const buildQueryParams = (): Record<string, string | string[]> => {
    const params: Record<string, string | string[]> = {
      page: String(pageIndex + 1),
      limit: String(pageSize),
    }
    if (searchParams) {
      if (searchParams.customerId) params.customerId = searchParams.customerId
      if (searchParams.mobile) params.mobile = searchParams.mobile
      if (searchParams.pan) params.pan = searchParams.pan
      if (searchParams.email) params.email = searchParams.email
    }
    return params
  }

  const fetchWealthIFAUsers = async (): Promise<WealthData[]> => {
    const token = getToken()
    const params = buildQueryParams()
    const response = await axios.get(`${BACKEND_BASE_URL}/v1/wealth/ifa/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    })
    if (response.data?.data) {
      return response.data.data
    }
    return []
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['wealth-ifa', searchParams, pageIndex],
    queryFn: fetchWealthIFAUsers,
    enabled: searchParams !== null, // Only fetch when a search is performed
  })

  const mappedData: WealthData[] = (data || []).map((item: WealthApiUser) => ({
    id: String(item.id ?? ''),
    customerId: String(item.customer_id ?? ''),
    name: String(item.name ?? ''),
    mobile: String(item.mobile ?? ''),
    product: String(item.product ?? ''),
    pan: String(item.pan ?? ''),
    accountNumber: String(item.account_number ?? ''),
    bankName: String(item.bank_name ?? ''),
    ifsc: item.ifsc ? String(item.ifsc) : 0,
    email: String(item.email ?? ''),
    aadhar: String(item.aadhar ?? ''),
    panImgUrl: String(item.pan_img_url ?? ''),
    aadharImgUrl: String(item.aadhar_img_url ?? ''),
    cancelledChequeImgUrl: String(item.cancelled_cheque_img_url ?? ''),
    status: String(item.status ?? ''),
    arn: String(item.arn ?? ''),
    companyName: String(item.company_name ?? ''),
  }))

  const handleFileDownload = async (fileUrl: string, fileName: string) => {
  try {
    const token = getToken()
    const response = await axios.get(`${BACKEND_BASE_URL}/v1/wealth/ifa/file`, {
      params: { url: fileUrl },
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = fileName
    a.click()
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    alert(`Failed to download file: ${getErrorMessage(error)}`)
  }
}


  const getErrorMessage = (err: unknown): string => {
    if (isAxiosError(err)) {
      if (err.response?.data?.message) {
        return err.response.data.message
      }
      return err.message
    }
    if (err instanceof Error) {
      return err.message
    }
    return 'An unknown error occurred'
  }
  // Search handler
  const handleSearch = (fields: { customerId: string; mobile: string; pan: string; email: string }) => {
    setSearchParams(fields)
    setPageIndex(0) // Reset to first page on new search
  }

  // Reset handler
  const handleReset = () => {
    setSearchParams(null)
    setPageIndex(0)
  }

  const columns = wealthColumns(searchParams, pageIndex, handleFileDownload);
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
              IFA Wealth Management
            </h2>
            <p className='text-muted-foreground'>
              Search and view IFA customer with detailed filters.
            </p>
          </div>
        </div>
        <WealthSearch onSearch={handleSearch} onReset={handleReset} />
        <Separator className='mt-4 shadow-sm' />
        <div className='my-4 flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Wealth IFA Results
          </h2>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          {isLoading ? (
            <div>Loading transactions...</div>
          ) : isError ? (
            <div className='text-red-500'>Error: {getErrorMessage(error)}</div>
          ) : (
            <>
            <WealthTable columns={columns} data={mappedData} />
              <WealthTablePagination
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
