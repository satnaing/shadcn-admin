import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { columns, BureauRow } from './components/bureau-columns';
import { BureauTable } from './components/bureau-table';
import { BureauSearch } from './components/bureau-search';
import { SimpleDataTablePagination } from './components/data-table-pagination';
import axios from 'axios';
import { getToken } from '@/lib/utils';


const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL; // Placeholder for real API
const token = getToken();

export default function Bureau() {
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<{
    name?: string;
    customer_id?: number;
    bureau_id?: number;
    start_date?: string;
    end_date?: string;
    pull_source?: string | number;
    score?: number;
  }>({});
  const [bureauList, setBureauList] = useState<BureauRow[]>([]);
  const [_isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (
    params: {
      name?: string;
      customer_id?: number | string;
      bureau_id?: number | string;
      start_date?: string;
      end_date?: string;
      pull_source?: string;
      score?: number | string;
    },
    page: number = 0
  ) => {
    // Always parse numeric fields to numbers if possible
    const parsedParams = {
      ...params,
      customer_id:
        params.customer_id !== undefined && params.customer_id !== null &&
        (typeof params.customer_id === 'string' ? params.customer_id !== '' : true)
          ? Number(params.customer_id)
          : undefined,
      bureau_id:
        params.bureau_id !== undefined && params.bureau_id !== null &&
        (typeof params.bureau_id === 'string' ? params.bureau_id !== '' : true)
          ? Number(params.bureau_id)
          : undefined,
      score:
        params.score !== undefined && params.score !== null &&
        (typeof params.score === 'string' ? params.score !== '' : true)
          ? Number(params.score)
          : undefined,
      pull_source:
        params.pull_source !== undefined && params.pull_source !== null &&
        (typeof params.pull_source === 'string' && params.pull_source !== '' && !isNaN(Number(params.pull_source)))
          ? Number(params.pull_source)
          : params.pull_source,
    };
    setSearchParams(parsedParams);
    setPageIndex(page);
    setIsLoading(true);
    setSearchPerformed(true);
    try {
      const searchParamsWithPage: Record<string, string | number> = {
        page: page + 1,
        limit: pageSize,
        ...(parsedParams.name ? { name: parsedParams.name } : {}),
        ...(parsedParams.customer_id !== undefined && parsedParams.customer_id !== null ? { customer_id: parsedParams.customer_id } : {}),
        ...(parsedParams.bureau_id !== undefined && parsedParams.bureau_id !== null ? { bureau_id: parsedParams.bureau_id } : {}),
        ...(parsedParams.start_date ? { start_date: parsedParams.start_date } : {}),
        ...(parsedParams.end_date ? { end_date: parsedParams.end_date } : {}),
        ...(parsedParams.pull_source ? { pull_source: parsedParams.pull_source } : {}),
        ...(parsedParams.score !== undefined && parsedParams.score !== null ? { score: parsedParams.score } : {}),
      };
      Object.keys(searchParamsWithPage).forEach((k: string) => {
        if (
          searchParamsWithPage[k as keyof typeof searchParamsWithPage] === undefined ||
          searchParamsWithPage[k as keyof typeof searchParamsWithPage] === ''
        ) {
          delete searchParamsWithPage[k as keyof typeof searchParamsWithPage];
        }
      });
      const response = await axios.get(`${BACKEND_BASE_URL}/v1/bureau/getAllReports`, {
        params: searchParamsWithPage,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      // Debug log for backend response
       console.log('Bureau Report response1:', response.data.data.bureaureports);
      // Try to find the correct array for the table
      let bureauRows: BureauRow[] = [];
      bureauRows = response.data.data.bureaureports;
      console.log('Bureau rows for table:', bureauRows);
      if (bureauRows.length <= 0){
        console.warn('No rows to display in BureauTable.');
      } 
     
      

      setBureauList(bureauRows);
    } catch (_e) {
      setBureauList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchParams({});
    setPageIndex(0);
    setBureauList([]);
    setSearchPerformed(false);
  };

  const handleSetPageIndex = (idx: number) => {
    if (Object.keys(searchParams).length > 0) {
      // Ensure pull_source is string for handleSearch signature
      const paramsForSearch = {
        ...searchParams,
        pull_source:
          typeof searchParams.pull_source === 'number'
            ? String(searchParams.pull_source)
            : searchParams.pull_source,
      };
      handleSearch(paramsForSearch, idx);
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
            <h2 className="text-2xl font-bold tracking-tight">Bureau List</h2>
            <p className="text-muted-foreground">
              Manage bureau reports and scores here.
            </p>
          </div>
        </div>
        <BureauSearch onSearch={handleSearch} onReset={handleReset} />
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12">
          <BureauTable
            data={bureauList}
            columns={columns}
            emptyMessage={searchPerformed ? 'No bureau records found.' : 'Please search to see bureau records.'}
          />
          {searchPerformed && bureauList.length > 0 && (
            <SimpleDataTablePagination
              pageIndex={pageIndex}
              setPageIndex={handleSetPageIndex}
              pageSize={pageSize}
              setPageSize={setPageSize}
              isLastPage={bureauList.length < pageSize}
            />
          )}
        </div>
      </Main>
    </>
  );
}


