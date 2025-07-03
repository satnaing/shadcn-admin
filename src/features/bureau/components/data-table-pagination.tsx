import { Button } from '@/components/ui/button';

interface SimpleDataTablePaginationProps {
  pageIndex: number;
  setPageIndex: (index: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  isLastPage: boolean;
}

export function SimpleDataTablePagination({
  pageIndex,
  setPageIndex,
  //pageSize,
  //setPageSize,
  isLastPage,
}: SimpleDataTablePaginationProps) {
  return (
    <div className="flex items-center justify-center py-4 w-full">
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <span className="sr-only">Go to previous page</span>
          {'<'}
        </Button>
        <span className="mx-2 text-sm font-medium">
          Page {Number.isFinite(pageIndex) && pageIndex >= 0 ? pageIndex + 1 : 1}
        </span>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={isLastPage}
        >
          <span className="sr-only">Go to next page</span>
          {'>'}
        </Button>
      </div>
    </div>
  );
}
