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
import{ UsersSearch } from './components/search-users';

const getToken = () => {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};

export default function Users() {
  const { data: userList, isLoading, isError, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const token = getToken();
      console.log('Token:', token);

      try {
        const response = await axios.get('http://localhost:3003/v1/superadmin/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log('Response:', response.data);
        return response.data;
      } catch (err) {
        console.error('Error fetching users:', err);
        throw err;
      }
    },
  });

  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleSearch = async (params: { id: string; email: string; phone: string; createdAt: string }) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      const token = getToken();
      // Only include non-empty params
      const filteredParams: Record<string, string> = {};
      if (params.id) filteredParams.id = params.id;
      if (params.email) filteredParams.email = params.email;
      if (params.phone) filteredParams.phone = params.phone;
      if (params.createdAt) filteredParams.createdAt = params.createdAt;

      const response = await axios.get('http://localhost:3003/v1/superadmin/user', {
        params: filteredParams,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setFilteredUsers(response.data);
    } catch (err: any) {
      setSearchError(err?.message || 'Failed to search users');
    } finally {
      setSearchLoading(false);
    }
  };


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
        <UsersSearch onSearch={handleSearch}  onReset={() => setFilteredUsers(null)} />
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          {searchLoading ? (
            <div>Searching users...</div>
          ) : searchError ? (
            <div>Error: {searchError}</div>
          ) : (
            <UsersTable data={filteredUsers !== null ? filteredUsers : userList} columns={columns} />
          )}
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  );
}
