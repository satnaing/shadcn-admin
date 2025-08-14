import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UPISearch } from './components/upi-search'
import { UPITransactionsTable, UPITransaction } from './components/upi-transactions-table'
import { Separator } from '@/components/ui/separator'
import { upiColumns } from './components/upi-columns'
import { UPITablePagination } from './components/upi-table-pagination'

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const getToken = () => {
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ''
}

interface UPISearchFields {
  customer_id?: string
  utr?: string
  txn_status?: string
  isDownload?: boolean
}

export default function UPI() {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 20
  const [searchParams, setSearchParams] = useState<UPISearchFields | null>(null)

  // Build query params for API
  const buildQueryParams = (): Record<string, string | number | boolean> => {
    const params: Record<string, string | number | boolean> = {
      page: pageIndex + 1,
      limit: pageSize,
    }
    if (searchParams) {
      if (searchParams.customer_id) params.customer_id = searchParams.customer_id
      if (searchParams.utr) params.utr = searchParams.utr
      if (searchParams.txn_status) params.txn_status = searchParams.txn_status
      if (searchParams.isDownload) params.isDownload = searchParams.isDownload
    }
    return params
  }

  const fetchUPITransactions = async (): Promise<UPITransaction[]> => {
    const token = getToken();
    const params = buildQueryParams();
    const response = await axios.post(
      `${BACKEND_BASE_URL}/v1/upi/getUpiTxns`,
      params, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    if (response.data?.data?.transactions) {
      return response.data.data.transactions;
    }
    return [];
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['upi-transactions', pageIndex, pageSize, searchParams],
    queryFn: fetchUPITransactions,
    enabled: searchParams !== null, // Only fetch when a search is performed
  })

  // Defensive mapping
  const mappedData: UPITransaction[] = (data || []).map((item) => {
    const t = item as unknown as Record<string, unknown>
    return {
      customer_id: String(t.customer_id ?? ''),
      payer_vpa: String(t.payer_vpa ?? ''),
      mobile: String(t.mobile ?? ''),
      payee_vpa: String(t.payee_vpa ?? ''),
      payee_acc_number: String(t.payee_acc_number ?? ''),
      payee_ifsc: String(t.payee_ifsc ?? ''),
      utr: String(t.utr ?? ''),
      amount: String(t.amount ?? ''),
      txn_status: String(t.txn_status ?? ''),
      response_code: String(t.response_code ?? ''),
      response_message: String(t.response_message ?? ''),
      created_at: String(t.created_at ?? ''),
      updated_at: String(t.updated_at ?? ''),
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

  // A better error message display
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
              UPI Transaction Panel
            </h2>
            <p className='text-muted-foreground'>
              Search and view UPI transactions with detailed filters.
            </p>
          </div>
        </div>
        <UPISearch onSearch={handleSearch} onReset={handleReset} />
        <Separator className='shadow-sm mt-4' />
        <div className='my-4 flex items-center justify-between'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Transaction Results
          </h2>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {isLoading ? (
            <div>Loading transactions...</div>
          ) : isError ? (
            <div className="text-red-500">Error: {getErrorMessage(error)}</div>
          ) : (
            <>
              <UPITransactionsTable data={mappedData} columns={upiColumns} />
              <UPITablePagination
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

 