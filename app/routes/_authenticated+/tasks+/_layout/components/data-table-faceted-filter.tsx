import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons'
import type * as React from 'react'
import { useSearchParams } from 'react-router'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '~/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { Separator } from '~/components/ui/separator'
import { cn } from '~/lib/utils'

interface DataTableFacetedFilterProps {
  title?: string
  searchParamKey: string
  options: {
    label: string
    value: string
    count?: number
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

export function DataTableFacetedFilter({
  title,
  searchParamKey,
  options,
}: DataTableFacetedFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedValues = searchParams.getAll(searchParamKey)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="h-4 w-4" />
          {title}
          {selectedValues?.length > 0 && (
            <>
              <Separator orientation="vertical" className="h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        setSearchParams(
                          (prev) => {
                            prev.delete(searchParamKey, option.value)
                            return prev
                          },
                          { preventScrollReset: true },
                        )
                      } else {
                        setSearchParams(
                          (prev) => {
                            prev.append(searchParamKey, option.value)
                            return prev
                          },
                          { preventScrollReset: true },
                        )
                      }
                    }}
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    {option.icon && (
                      <option.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>

                    <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                      {option.count}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() =>
                      setSearchParams(
                        (prev) => {
                          prev.delete(searchParamKey)
                          return prev
                        },
                        { preventScrollReset: true },
                      )
                    }
                    className="justify-center text-center"
                  >
                    Clear filters
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
