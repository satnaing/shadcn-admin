import { Column } from '@tanstack/react-table'
import { Check, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { accountGroupService } from '@/services/account-group-service'
import { Option } from '@/types/options'
import { Spinner } from '@/components/ui/spinner'

interface DataTableGroupFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
}

export function DataTableGroupFilter<TData, TValue>({
  column,
  title,
}: DataTableGroupFilterProps<TData, TValue>) {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: Option }>({})
  const selectedValues = column?.getFilterValue()
  const [searchTerm, setSearchTerm] = useState<string>('')

  const { data: options, isLoading, ...rest } = useQuery({
    queryKey: [`${accountGroupService.path}/options`, searchTerm],
    queryFn: () => accountGroupService.getOptions(searchTerm, 7),
    // placeholderData: keepPreviousData,
  })

  console.log("DataTableGroupFilter: ", Object.keys(selectedOptions).length, isLoading, rest)

  useEffect(() => {
    if (!selectedValues) {
      setSelectedOptions({})
    }
  }, [selectedValues])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusCircle className='mr-2 h-4 w-4' />
          {title}
          {Object.keys(selectedOptions).length > 0 && (
            <>
              <Separator orientation='vertical' className='mx-2 h-4' />
              <Badge
                variant='secondary'
                className='rounded-sm px-1 font-normal lg:hidden'
              >
                {Object.keys(selectedOptions).length}
              </Badge>
              <div className='hidden space-x-1 lg:flex'>
                {Object.values(selectedOptions)
                  .map((option) => (
                    <Badge
                      variant='secondary'
                      key={option.value}
                      className='rounded-sm px-1 font-normal'
                    >
                      {option.label}
                    </Badge>
                  ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command shouldFilter={false}>
          <CommandInput placeholder={title} value={searchTerm} onValueChange={setSearchTerm} />
          <CommandList>
            {isLoading && <CommandLoading>
              <div className="flex items-center justify-center py-4">
                <Spinner className="h-4 w-4" />
                <span className="ml-2 text-sm text-muted-foreground">加载中...</span>
              </div>
            </CommandLoading>}
            <CommandEmpty>无匹配结果</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = selectedOptions[option.value]
                console.log("map: ", option)
                return (
                  <CommandItem
                    value={option.value}
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        delete selectedOptions[option.value]
                      } else {
                        selectedOptions[option.value] = option
                      }

                      const filterValues = Object.keys(selectedOptions)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className={cn(
                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <Check className={cn('h-4 w-4')} />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {Object.keys(selectedOptions).length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      column?.setFilterValue(undefined)
                      setSelectedOptions({})
                    }}
                    className='justify-center text-center'
                  >
                    清除筛选
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 