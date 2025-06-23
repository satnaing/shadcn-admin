import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/customers-columns';
import { CustomersTable } from './components/customers-table';
import { CustomersSearch } from './components/search-customers';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const getToken = () => {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Customers() {
  const [pageIndex, setPageIndex] = useState(0); // 0-based, default page=1
  const [pageSize, setPageSize] = useState(10); // default limit=10
  const [searchParams, setSearchParams] = useState<{ id?: string; email?: string; mobile?: string }>({});

  const fetchCustomers = async () => {
    const token = getToken();
    const params: Record<string, string> = {
      page: String(pageIndex + 1),
      limit: String(pageSize),
      ...searchParams,
    };
    // Remove empty params
    Object.keys(params).forEach((k) => (params[k] === undefined || params[k] === '') && delete params[k]);
    const response = await axios.get(`${BACKEND_BASE_URL}/v1/customer/getCustomers`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    // Assume response.data.customers or response.data.data or response.data
    return response.data.customers || response.data.data || response.data;
  };
  //console.log("response data", response.data);

  const { data: customerList = [], isLoading } = useQuery({
    queryKey: ['customers', pageIndex, pageSize, searchParams],
    queryFn: fetchCustomers,
    // keepPreviousData: true, // Removed due to type error with current react-query version
  });

  const handleSearch = (params: { id?: string; email?: string; mobile?: string }) => {
    setSearchParams(params);
    setPageIndex(0);
  };
  const handleReset = () => {
    setSearchParams({});
    setPageIndex(0);
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
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <CustomersTable data={customerList} columns={columns} pageIndex={pageIndex} setPageIndex={setPageIndex} pageSize={pageSize} setPageSize={setPageSize} isLoading={isLoading} />
        </div>
      </Main>
    </>
  );
}