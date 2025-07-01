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

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL; // Placeholder for real API

export default function Bureau() {
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<{ score?: string; reportId?: string; bureauType?: string }>({});
  const [bureauList, setBureauList] = useState<BureauRow[]>([]);
  const [_isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (params: { score?: string; reportId?: string; bureauType?: string }, page: number = 0) => {
    setSearchParams(params);
    setPageIndex(page);
    setIsLoading(true);
    setSearchPerformed(true);
    try {
      const searchParamsWithPage: Record<string, string> = {
        page: String(page + 1),
        limit: String(pageSize),
        ...(params.score ? { score: params.score } : {}),
        ...(params.reportId ? { reportId: params.reportId } : {}),
        ...(params.bureauType ? { bureauType: params.bureauType } : {}),
      };
      Object.keys(searchParamsWithPage).forEach((k: string) => {
        if (
          searchParamsWithPage[k as keyof typeof searchParamsWithPage] === undefined ||
          searchParamsWithPage[k as keyof typeof searchParamsWithPage] === ''
        ) {
          delete searchParamsWithPage[k as keyof typeof searchParamsWithPage];
        }
      });
      const response = await axios.get(`${BACKEND_BASE_URL}/bureau`, {
        params: searchParamsWithPage,
      });
      setBureauList(response.data.data || response.data || []);
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
      handleSearch(searchParams, idx);
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


