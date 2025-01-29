import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { SEARCH_FIELD } from '../config'

interface SearchInputProps extends React.ComponentPropsWithRef<typeof Input> {}
export const SearchInput = ({ className, ...rest }: SearchInputProps) => {
  const [searchParams] = useSearchParams()

  return (
    <form className="flex items-center gap-0.5" method="GET">
      {/* This is a hidden input that will be used to store the search field value */}
      {[...searchParams.entries()].map(([key, value]) => {
        if ([SEARCH_FIELD, 'page'].includes(key)) return null // exclude search field and page from hidden inputs
        return <input key={key} type="hidden" name={key} value={value} />
      })}

      <div className="group focus-within:ring-ring flex max-w-xl rounded-md focus-within:ring">
        <div className="relative flex-1">
          <div className="absolute top-0 left-3 flex h-full items-center">
            <Search className="text-muted-foreground h-4 w-4" />
          </div>
          <Input
            defaultValue={searchParams.get(SEARCH_FIELD) ?? undefined}
            name={SEARCH_FIELD}
            type="text"
            placeholder="Search..."
            className={cn(
              'h-8 w-full rounded-r-none border-r-0 pl-10 focus-visible:ring-0 focus-visible:ring-offset-0',
              className,
            )}
            {...rest}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="flex items-center gap-2 rounded-l-none px-4 focus-visible:ring-0 focus-visible:ring-offset-0"
          tabIndex={-1}
        >
          Search
        </Button>
      </div>
    </form>
  )
}
