// import React from "react";
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios, { isAxiosError } from 'axios'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TransactionSearch } from './components/transaction-search'
import { TransactionsTable, Transaction } from './components/transactions-table'
import { Separator } from '@/components/ui/separator'
import { bbpsColumns } from './components/bbps-columns'
import { BBPSTablePagination } from './components/bbps-table-pagination'

// const BACKEND_BASE_URL = 'https://eqxstaging.stashfin.com/admin'
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
const getToken = () => {
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : ''
}

interface TransactionSearchFields {
  id?: string
  bbpsReferenceCode?: string
  mobileNumber?: string
  category?: string
  start_date?: string
  end_date?: string
  customerId?: string
  paymentStatus?: string
}

export default function BBPS() {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10
  const [searchParams, setSearchParams] = useState<TransactionSearchFields | null>(null)

  // Build query params for API
  const buildQueryParams = (): Record<string, string> => {
    const params: Record<string, string> = {
      page: String(pageIndex + 1),
      limit: String(pageSize),
    }
    if (searchParams) {
      if (searchParams.id) params.transaction_id = searchParams.id
      if (searchParams.bbpsReferenceCode) params.bbps_ref_no = searchParams.bbpsReferenceCode
      if (searchParams.customerId) params.customer_id = searchParams.customerId
      if (searchParams.paymentStatus) params.status = searchParams.paymentStatus
      if (searchParams.mobileNumber) params.mobile = searchParams.mobileNumber
      if (searchParams.category) params.category = searchParams.category
      if (searchParams.start_date) params.start_date = searchParams.start_date
      if (searchParams.end_date) params.end_date = searchParams.end_date
    }
    return params
  }

  const fetchTransactions = async (): Promise<Record<string, unknown>[]> => {
    const token = getToken();
    const params = buildQueryParams();
    const response = await axios.get(
      `${BACKEND_BASE_URL}/v1/bbps/getAllTransactions`,
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    if (response.data?.data?.transactions) {
      return response.data.data.transactions;
    }
    return [];
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['bbps-transactions', pageIndex, pageSize, searchParams],
    queryFn: fetchTransactions,
    enabled: searchParams !== null, // Only fetch when a search is performed
  })

  // Defensive mapping
  const mappedData: Transaction[] = (data || []).map((item) => {
    const t = item as Record<string, unknown>
    return {
      id: String(t.transaction_id ?? ''),
      bbpsReferenceCode: String(t.bbps_ref_no ?? ''),
      customerId: String(t.customer_id ?? ''),
      pgTxnRefId: String(t.pg_txn_ref_id ?? ''),
      customerName: String(t.name ?? ''),
      mobileNumber: String(t.mobile ?? ''),
      category: String(t.category ?? ''),
      billerName: String(t.biller_name ?? ''),
      billAmount: Number(t.bill_amount) || 0,
      paymentMode: String(t.mode ?? ''),
      transactionStatus: String(t.status ?? 'Pending'),
      transactionDate: String(t.transaction_date ?? ''),
      customer_account_no: String(t.customer_account_no ?? ''),
    }
  })

  // Search handler
  const handleSearch = (fields: TransactionSearchFields) => {
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
              BBPS Transaction Panel
            </h2>
            <p className='text-muted-foreground'>
              Search and view bill payment transactions with detailed filters.
            </p>
          </div>
        </div>
        <TransactionSearch onSearch={handleSearch} onReset={handleReset} />
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
              <TransactionsTable data={mappedData} columns={bbpsColumns} />
              <BBPSTablePagination
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
