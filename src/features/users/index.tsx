import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/users-columns';
import { UsersDialogs } from './components/users-dialogs';
import { UsersPrimaryButtons } from './components/users-primary-buttons';
import { UsersTable } from './components/users-table';
import UsersProvider from './context/users-context';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { DataTablePagination } from './components/data-table-pagination'
import { UsersSearch } from './components/search-users';

// Extend the Window interface to include __isLastPage
declare global {
  interface Window {
    __isLastPage?: boolean;
  }
}

const getToken = () => {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Users() {
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize] = useState(10);
  // const [totalCount, setTotalCount] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  interface User {
    id: string;
    email: string;
    role: "superadmin" | "admin" | "cashier" | "manager";
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    status: "active" | "inactive" | "invited" | "suspended";
    createdAt: Date;
    updatedAt: Date;
  }
  const [searchResults, setSearchResults] = useState<User[] | null>(null);

  // Backend-driven pagination (default table view)
  const fetchUsers = async () => {
    const token = getToken();
    const params = {
      page: String(pageIndex + 1), // send as string
      limit: String(pageSize),     // send as string
    };
    const response = await axios.get(`${BACKEND_BASE_URL}/v1/superadmin/allUser`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    // setTotalCount(response.data.totalCount || response.data.total || 0);
    return response.data.users || response.data.data || response.data;
  };

 
  // react-query for paginated users
  const { data: userList, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['users', pageIndex, pageSize],
    queryFn: fetchUsers,
  });



  // Search handler (independent of pagination)
  const handleSearch = async (params: { userId: string; email: string; phone: string; createdAt: string }) => {
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults(null);
    try {
      const token = getToken();
      const filteredParams: Record<string, string> = {};
      if (params.userId) filteredParams.userId = params.userId;
      if (params.email) filteredParams.email = params.email;
      if (params.phone) filteredParams.phone = params.phone;
      if (params.createdAt) filteredParams.dateCreated = params.createdAt; // map to backend param
      const response = await axios.get(`${BACKEND_BASE_URL}/v1/superadmin/allUser`, {
        params: filteredParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setSearchResults(response.data.users || response.data.data || response.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSearchError(err.message);
      } else {
        setSearchError('Failed to search users');
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // Reset search and return to paginated view
  const handleReset = () => {
    setSearchResults(null);
    setSearchError(null);
    setSearchLoading(false);
    refetch();
  };

  // Debug: log pageIndex changes
  const handleSetPageIndex = (idx: number) => {
   // console.log('Setting pageIndex:', idx);
    setPageIndex(idx);
  };

  // Set isLastPage global for pagination (
  if (typeof window !== 'undefined') {
    window.__isLastPage = Array.isArray(userList) && userList.length < pageSize;
  }

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <UsersProvider>
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
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <UsersSearch onSearch={handleSearch} onReset={handleReset} />
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {searchLoading ? (
            <div>Searching users...</div>
          ) : searchError ? (
            <div>Error: {searchError}</div>
          ) : searchResults ? (
            <UsersTable data={searchResults} columns={columns} />
          ) : (
            <>
              <UsersTable data={userList} columns={columns} />
              <DataTablePagination
                pageIndex={pageIndex}
                setPageIndex={handleSetPageIndex}
              />
            </>
          )}
        </div>
      </Main>
      <UsersDialogs />
    </UsersProvider>
  );
}
