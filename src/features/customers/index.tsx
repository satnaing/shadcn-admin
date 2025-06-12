import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns } from './components/customers-columns';


import { CustomersTable } from './components/customers-table';
import { customer as mockCustomers } from './data/customer'; // <-- Import mock data
 
// import { useQuery } from '@tanstack/react-query';
// import axios from 'axios';

// const getToken = () => {
//   const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
//   return match ? decodeURIComponent(match[1]) : '';
// };

export default function Customers() {
    // const { data: customerList, isLoading, isError, error } = useQuery({
    //   queryKey: ['customers'],
    //   queryFn: async () => {
    //     const token = getToken();
    //     try {
    //       // Update the endpoint to our customers API
    //       const response = await axios.get(' API ', {
    //         headers: {
    //           Authorization: `Bearer ${token}`,
    //         },
    //         withCredentials: true,
    //       });
    //       return response.data;
    //     } catch (err) {
    //       throw err;
    //     }
    //   },
    // });

    // if (isLoading) return <div>Loading customers...</div>;
    // if (isError) return <div>Error: {error.message}</div>;
  
  const customerList = mockCustomers; // Use mock data for now
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
        {/* <DataTableToolbar
        data={mockCustomers}
        onFilter={setFilteredCustomers}
        /> */}
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <CustomersTable data={customerList} columns={columns} />
        </div>
      </Main>
    </>
  );
}