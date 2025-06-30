import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { allColumns, defaultColumns } from './components/customers-columns';
import { CustomersTable } from './components/customers-table';
import { CustomersSearch } from './components/search-customers';
import axios from 'axios';

const getToken = () => {
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Customers() {
  const [customerList, setCustomerList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const [error, setError] = useState<any>(null);
  const [searchParamsState, setSearchParamsState] = useState<{ id?: string; email?: string; mobile?: string }>({});

  // Pagination
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<{ id?: string; email?: string; mobile?: string }>({});
  const [showAllColumns, setShowAllColumns] = useState(false);
  const visibleColumns = showAllColumns ? allColumns : defaultColumns;

  // Only fetch/search customers when search is performed
  const handleSearch = async (params: { id?: string; email?: string; mobile?: string }, page: number = 0) => {
    setSearchParams(params);
    setSearchParamsState(params);
    setPageIndex(page);
    setIsLoading(true);
    // setIsError(false);
    // setError(null);
    try {
      const token = getToken();
      const searchParamsWithPage: Record<string, string> = {
        page: String(page + 1),
        limit: String(pageSize),
        ...(params.id ? { id: params.id } : {}),
        ...(params.email ? { email: params.email } : {}),
        ...(params.mobile ? { mobile: params.mobile } : {}),
      };
      Object.keys(searchParamsWithPage).forEach((k) => (searchParamsWithPage[k as keyof typeof searchParamsWithPage] === undefined || searchParamsWithPage[k as keyof typeof searchParamsWithPage] === '') && delete (searchParamsWithPage as any)[k]);
      const response = await axios.get(`${BACKEND_BASE_URL}/v1/customer/allCustomers`, {
        params: searchParamsWithPage,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setCustomerList(response.data.data.customers || response.data.data || response.data || []);
    } catch (_e) {
      setCustomerList([]);
      // setIsError(true);
      // setError(_e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({});
    setSearchParamsState({});
    setPageIndex(0);
    setCustomerList([]);
  };

  // Pagination for search results
  const handleSetPageIndex = (idx: number) => {
    if (Object.keys(searchParamsState).length > 0) {
      handleSearch(searchParamsState, idx);
    }
    setPageIndex(idx);
  };

  return (
    <>
      <Header fixed>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Customer List</h2>
            <p className="text-muted-foreground">
              Manage your customers and their details here.
            </p>
          </div>
        </div>
        <CustomersSearch onSearch={handleSearch} onReset={handleReset} />
        <div className="mb-2 flex items-center">
          <button
            className="ml-auto rounded border bg-muted px-3 py-1 text-xs transition-colors hover:bg-accent"
            onClick={() => setShowAllColumns((v) => !v)}
          >
            {showAllColumns ? 'Show Less Columns' : 'Show More Columns'}
          </button>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <CustomersTable
            data={customerList}
            columns={visibleColumns}
            pageIndex={pageIndex}
            setPageIndex={handleSetPageIndex}
            pageSize={pageSize}
            setPageSize={setPageSize}
            isLoading={isLoading}
            emptyMessage={Object.keys(searchParams).length === 0 ? 'Please search to see customers.' : 'No customers found.'}
          />
        </div>
      </Main>
    </>
  );
}