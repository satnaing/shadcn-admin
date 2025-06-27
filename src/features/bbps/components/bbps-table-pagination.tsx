import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'

interface DataTablePaginationProps {
  pageIndex: number
  setPageIndex: (index: number) => void

}
export function BBPSTablePagination({
  pageIndex,
  setPageIndex,
  
}: DataTablePaginationProps) {

  return (
    <div className='flex items-center justify-center py-4 w-full'>
      <div className='flex items-center justify-center gap-2'>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <span className='sr-only'>Go to previous page</span>
          <ChevronLeftIcon className='h-4 w-4' />
        </Button>
        <span className='mx-2 text-sm font-medium'>
          Page {Number.isFinite(pageIndex) && pageIndex >= 0 ? pageIndex + 1 : 1}
        </span>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={typeof window !== 'undefined' && window.__isLastPage}
        >
          <span className='sr-only'>Go to next page</span>
          <ChevronRightIcon className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

