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
//import { useQuery } from '@tanstack/react-query';
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
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export default function Users() {
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize] = useState(10);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  interface User {
    id: string;
    email: string;
    role: "superadmin" | "admin" | "cashier" | "manager";
    firstName: string;
    lastName: string;
    username: string;
    mobile: string;
    status: "active" | "inactive" | "invited" | "suspended";
    createdAt: Date;
    updatedAt: Date;
  }
  const [searchResults, setSearchResults] = useState<User[] | null>(null);

  // Remove default paginated fetch
  // const { data: userList, isLoading, isError, error, refetch } = useQuery({ ... });

  // Only fetch/search users when search is performed
  const [userList, setUserList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // Search handler with pagination
  const handleSearch = async (params: { userId: string; email: string; mobile: string; createdAt: string }, page: number = 0) => {
    // Only search if at least one field is filled
    const hasAnyField = Object.values(params).some((v) => v && v.trim() !== '');
    if (!hasAnyField) {
      setUserList([]);
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
      setIsLoading(false);
      return;
    }
    setSearchLoading(true);
    setSearchError(null);
    setIsLoading(true);
    setIsError(false);
    setError(null);
    setSearchResults(null);
    try {
      const token = getToken();
      const filteredParams: Record<string, string> = {};
      if (params.userId) filteredParams.userId = params.userId;
      if (params.email) filteredParams.email = params.email;
      if (params.mobile) filteredParams.phone_number = params.mobile;
      if (params.createdAt) filteredParams.dateCreated = params.createdAt;
      filteredParams.page = String(page + 1);
      filteredParams.limit = String(pageSize);
      const response = await axios.get(`${BACKEND_BASE_URL}/v1/superadmin/allUser`, {
        params: filteredParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      let results = response.data.users || response.data.data || response.data;
      // Frontend filtering for mobile if backend does not filter
      if ('_frontendMobileSearch' in params && params._frontendMobileSearch) {
        results = results.filter((user: Record<string, unknown>) =>
          user.phone_number === params._frontendMobileSearch ||
          user.mobile === params._frontendMobileSearch ||
          user.phoneNumber === params._frontendMobileSearch
        );
      }
      const mappedResults = results.map((user: Record<string, unknown>) => ({
        ...user,
        mobile: (user as { phone_number?: string }).phone_number || (user as { mobile?: string }).mobile || (user as { phoneNumber?: string }).phoneNumber || '',
      }));
      setUserList(mappedResults);
      setSearchResults(mappedResults);
      setPageIndex(page);
    } catch (err: unknown) {
      setUserList([]);
      setSearchResults([]);
      setIsError(true);
      setError(err);
      if (err instanceof Error) {
        setSearchError(err.message);
      } else {
        setSearchError('Failed to search users');
      }
    } finally {
      setSearchLoading(false);
      setIsLoading(false);
    }
  };

  // Reset search and table
  const handleReset = () => {
    setSearchResults(null);
    setSearchError(null);
    setSearchLoading(false);
    setUserList([]);
    setPageIndex(0);
  };

  // Pagination for search results
  const handleSetPageIndex = (idx: number) => {
    if (searchResults !== null) {
      // Re-run search with new page
      handleSearch(
        {
          userId: '',
          email: '',
          mobile: '',
          createdAt: '',
          // You may want to keep the last search params in state for real use
        },
        idx
      );
    }
    setPageIndex(idx);
  };

  // Set isLastPage global for pagination (
  if (typeof window !== 'undefined') {
    window.__isLastPage = Array.isArray(userList) && userList.length < pageSize;
  }

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
          {searchLoading || isLoading ? (
            <div>Searching users...</div>
          ) : searchError || isError ? (
            <div>Error: {searchError || (typeof error === 'object' && error && 'message' in error ? (error as { message?: string }).message : '')}</div>
          ) : searchResults ? (
            <>
              <UsersTable data={userList} columns={columns} />
              <DataTablePagination
                pageIndex={pageIndex}
                setPageIndex={handleSetPageIndex}
              />
            </>
          ) : (
            <UsersTable data={[]} columns={columns} emptyMessage={'Please search to see users.'} />
          )}
        </div>
      </Main>
      <UsersDialogs />
    </UsersProvider>
  );
}
