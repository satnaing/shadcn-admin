import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function UsersTableRowSkeleton() {
  return (
    <TableRow className='group/row'>
      <TableCell className='bg-background group-hover/row:bg-muted'>
        <Skeleton className='bg-muted-foreground/20 h-4 w-4' />
      </TableCell>
      <TableCell className='bg-background group-hover/row:bg-muted'>
        <Skeleton className='bg-muted-foreground/20 h-4 w-24' />
      </TableCell>
      <TableCell className='bg-background group-hover/row:bg-muted'>
        <Skeleton className='bg-muted-foreground/20 h-4 w-32' />
      </TableCell>
      <TableCell className='bg-background group-hover/row:bg-muted'>
        <Skeleton className='bg-muted-foreground/20 h-4 w-40' />
      </TableCell>
      <TableCell className='bg-background group-hover/row:bg-muted'>
        <Skeleton className='bg-muted-foreground/20 h-4 w-28' />
      </TableCell>
      <TableCell className='bg-background group-hover/row:bg-muted'>
        <Skeleton className='bg-muted-foreground/20 h-5 w-16 rounded-full' />
      </TableCell>
      <TableCell className='bg-background group-hover/row:bg-muted'>
        <Skeleton className='bg-muted-foreground/20 h-5 w-20 rounded-full' />
      </TableCell>
      <TableCell className='bg-background group-hover/row:bg-muted'>
        <Skeleton className='bg-muted-foreground/20 h-8 w-8' />
      </TableCell>
    </TableRow>
  )
}

export function UsersTablePaginationSkeleton() {
  return (
    <div className='flex items-center justify-between overflow-clip px-2 @max-2xl/main:flex-col-reverse @max-2xl/main:gap-4'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex w-[100px] items-center justify-center @2xl/main:hidden'>
          <Skeleton className='bg-muted-foreground/20 h-4 w-20' />
        </div>
        <div className='flex items-center gap-2 @max-2xl/main:flex-row-reverse'>
          <Skeleton className='bg-muted-foreground/20 h-8 w-[70px]' />
          <Skeleton className='bg-muted-foreground/20 hidden h-4 w-24 sm:block' />
        </div>
      </div>

      <div className='flex items-center sm:space-x-6 lg:space-x-8'>
        <div className='flex w-[100px] items-center justify-center @max-3xl/main:hidden'>
          <Skeleton className='bg-muted-foreground/20 h-4 w-20' />
        </div>
        <div className='flex items-center space-x-2'>
          <Skeleton className='bg-muted-foreground/20 size-8' />
          <Skeleton className='bg-muted-foreground/20 size-8' />
          <Skeleton className='bg-muted-foreground/20 size-8' />
          <Skeleton className='bg-muted-foreground/20 size-8' />
          <Skeleton className='bg-muted-foreground/20 size-8' />
          <Skeleton className='bg-muted-foreground/20 size-8' />
        </div>
      </div>
    </div>
  )
}
