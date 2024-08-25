import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { IconLoader2, IconSearch, IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import usePrevious from '@/hooks/use-previous'
import { Separator } from '../ui/separator'
import { Button } from './button'

interface SearchInputProps {
  name?: string
  className?: string
  defaultSearchValue?: string
  isPending?: boolean
  placeholder?: string
  searchText?: string
  disableSearchParam?: boolean
  onSubmit: (text: string) => void
  searchParam?: 'search' | 'q'
}

const SearchInput = ({
  name = 'search',
  className,
  defaultSearchValue = '',
  isPending = false,
  placeholder = 'Search',
  searchText = 'Search',
  onSubmit,
  // disableSearchParam = false,
  // searchParam = 'search',
}: SearchInputProps) => {
  const navigate = useNavigate()
  const [value, setValue] = React.useState(defaultSearchValue)
  const previous = usePrevious(value)

  const reset = React.useCallback(() => {
    setValue('')
    onSubmit('')

    // if (!disableSearchParam)
    //   navigate({
    //     search: (prev) => ({ ...prev, [searchParam]: '' }),
    //   })
  }, [onSubmit])

  React.useEffect(() => {
    if (previous && previous?.trim().length > 0 && value.trim().length < 1)
      reset()
  }, [previous, reset, value])

  return (
    <form
      className={cn(
        `flex h-9 w-56 items-center space-x-0 rounded-md border border-input bg-white pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring`,
        className
      )}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(value)
        // if (!disableSearchParam)
        //   navigate({ search: (prev) => ({ ...prev, [searchParam]: value }) })
      }}
    >
      {isPending && value.trim().length > 0 ? (
        <IconLoader2 size={14} className='mr-2 animate-spin stroke-blue-500' />
      ) : (
        <IconSearch size={14} className='mr-2' />
      )}
      <div className='relative flex-1'>
        <input
          name={name}
          autoComplete='off'
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type='text'
          className={'w-full text-sm focus-visible:outline-none'}
        />
        {value.trim().length > 0 && (
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-1 top-1/2 size-6 -translate-y-1/2'
            onClick={reset}
          >
            <IconX size={14} />
          </Button>
        )}
      </div>
      <Separator orientation='vertical' />
      <Button
        variant='ghost'
        size='sm'
        className='h-full rounded-l-none rounded-r-md focus-visible:ring-2 focus-visible:ring-blue-500'
      >
        {searchText}
      </Button>
    </form>
  )
}
SearchInput.displayName = 'SearchInput'

export { SearchInput }
