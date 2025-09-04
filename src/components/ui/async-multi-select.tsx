'use client'

import * as React from 'react'
import { useEffect, useImperativeHandle, useRef } from 'react'
import { PopoverContentProps } from '@radix-ui/react-popover'
import { ChevronDown, X, CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Loadable } from '../loadable'

export interface Option {
  label: string
  value: string // should be unique, and not empty
}

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * An array of objects to be displayed in the Select.Option.
   */
  options: Option[]

  /**
   * Whether the select is async. If true, the getting options should be async.
   * Optional, defaults to false.
   */
  async?: boolean

  /**
   * Whether is fetching options. If true, the loading indicator will be shown.
   * Optional, defaults to false. Works only when async is true.
   */
  loading?: boolean

  /**
   * The error object. If true, the error message will be shown.
   * Optional, defaults to null. Works only when async is true.
   */
  error?: Error | null

  /** The default selected values when the component mounts. */
  defaultValue?: string[]

  /**
   * The selected values.
   * Optional, defaults to undefined.
   */
  value?: string[]

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string

  /**
   * Placeholder text to be displayed when the search input is empty.
   * Optional, defaults to "Search...".
   */
  searchPlaceholder?: string

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string

  /**
   * Text to be displayed when the clear button is clicked.
   * Optional, defaults to "Clear".
   */
  clearText?: string

  /**
   * Text to be displayed when the close button is clicked.
   * Optional, defaults to "Close".
   */
  closeText?: string

  /**
   * Whether to hide the select all option.
   * Optional, defaults to false.
   */
  hideSelectAll?: boolean

  /**
   * Whether to clear search input when popover closes.
   * Optional, defaults to false.
   */
  clearSearchOnClose?: boolean

  /**
   * Controlled search value. If provided, the component will use this value instead of internal state.
   * Optional, defaults to undefined.
   */
  searchValue?: string

  /**
   * Additional options for the popover content.
   * Optional, defaults to null.
   * portal: Whether to use portal to render the popover content. !!!need to modify the popover component!!!
   */
  popoverOptions?: PopoverContentProps & {
    portal?: boolean
  }

  /**
   * Custom label function.
   * Optional, defaults to null.
   */
  labelFunc?: (option: Option, isSelected: boolean, index: number) => React.ReactNode

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void

  /**
   * Callback function triggered when the search input changes.
   * Receives the search input value.
   */
  onSearch?: (value: string) => void
}

interface MultiAsyncSelectRef {
  setIsPopoverOpen: (open: boolean) => void
  setSearchValue: (value: string) => void
}

export const MultiAsyncSelect = React.forwardRef<MultiAsyncSelectRef, Props>(
  (
    {
      options,
      value,
      className,
      defaultValue = [],
      placeholder = 'Select...',
      searchPlaceholder = 'Search...',
      clearText = 'Clear',
      closeText = 'Close',
      maxCount = 3,
      modalPopover = false,
      loading = false,
      async = false,
      error = null,
      hideSelectAll = false,
      popoverOptions,
      labelFunc,
      onValueChange,
      onSearch,
      clearSearchOnClose = false,
      searchValue,
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue)
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
    const [searchValueState, setSearchValueState] = React.useState(searchValue || '')
    const [reserveOptions, setReserveOptions] = React.useState<Record<string, Option>>({})
    const optionsRef = useRef<Record<string, Option>>({})
    const isInit = useRef(false)

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true)
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues]
        newSelectedValues.pop()
        setSelectedValues(newSelectedValues)
        onValueChange(newSelectedValues)
      }
    }

    const toggleOption = (option: string) => {
      const isAddon = selectedValues.includes(option)
      const newSelectedValues = isAddon
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option]
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }

    const handleClear = () => {
      setSelectedValues([])
      onValueChange([])
    }

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount)
      setSelectedValues(newSelectedValues)
      onValueChange(newSelectedValues)
    }

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear()
      } else {
        const allValues = options.map((option) => option.value)
        setSelectedValues(allValues)
        onValueChange(allValues)
      }
    }

    useEffect(() => {
      const temp = options.reduce(
        (acc, option) => {
          acc[option.value] = option
          return acc
        },
        {} as Record<string, Option>
      )
      if (async) {
        if (!isInit.current) {
          optionsRef.current = temp
          setReserveOptions(temp)
          isInit.current = true
        } else {
          const temp2 = selectedValues.reduce(
            (acc, value) => {
              const option = optionsRef.current[value]
              if (option) {
                acc[option.value] = option
              }
              return acc
            },
            {} as Record<string, Option>
          )
          optionsRef.current = {
            ...temp,
            ...temp2,
          }
          setReserveOptions({
            ...temp,
            ...temp2,
          })
        }
      }
    }, [async, options, selectedValues])

    useEffect(() => {
      if (value) {
        setSelectedValues(value)
      }
    }, [value])

    useEffect(() => {
      if (searchValue !== undefined) {
        setSearchValueState(searchValue)
      }
    }, [searchValue])

    useImperativeHandle(ref, () => ({
      setIsPopoverOpen,
      setSearchValue: setSearchValueState,
    }))

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={(open) => {
          setIsPopoverOpen(open)
          if (!open && clearSearchOnClose) {
            setSearchValueState('')
            onSearch?.('')
          }
        }}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <div
            className={cn(
              'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-auto min-h-[36px] w-full min-w-[160px] cursor-pointer items-center justify-between rounded-md border px-2 py-0.5 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className='flex w-full items-center justify-between'>
                <div className='flex flex-wrap items-center gap-1 overflow-x-auto'>
                  {selectedValues.slice(0, maxCount).map((value) => {
                    let option: Option | undefined
                    if (async) {
                      option = reserveOptions[value]
                    } else {
                      option = options.find((option) => option.value === value)
                    }
                    return (
                      <div
                        className='hover:text-primary dark:hover:text-primary flex h-[26px] items-center gap-1 rounded-md border border-zinc-200 px-2 py-0.5 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600'
                        key={value}
                      >
                        <div className='flex max-w-[100px] items-center gap-1 truncate text-xs'>
                          {option?.label}
                        </div>
                        <X
                          className='box-content h-3 w-3 shrink-0 cursor-pointer rounded-full p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          onClick={(event) => {
                            event.stopPropagation()
                            toggleOption(value)
                          }}
                        />
                      </div>
                    )
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge variant='outline'>
                      <span>{`+ ${selectedValues.length - maxCount}`}</span>
                      <X
                        className='hover:text-primary ml-2 box-content h-3 w-3 shrink-0 cursor-pointer rounded-full p-1 text-zinc-300 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:bg-zinc-800'
                        onClick={(event) => {
                          event.stopPropagation()
                          clearExtraOptions()
                        }}
                      />
                    </Badge>
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <X
                    className='hover:text-primary ml-2 box-content h-4 w-4 shrink-0 cursor-pointer rounded-full p-1 text-zinc-300 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:bg-zinc-800'
                    onClick={(event) => {
                      event.stopPropagation()
                      handleClear()
                    }}
                  />
                  <Separator orientation='vertical' className='mx-2 flex h-full min-h-6' />
                  <ChevronDown className='hover:text-primary h-4 cursor-pointer text-zinc-300 dark:text-zinc-500' />
                </div>
              </div>
            ) : (
              <div className='mx-auto flex w-full items-center justify-between'>
                <span className='text-[12px] font-normal text-zinc-500'>{placeholder}</span>
                <ChevronDown className='h-4 cursor-pointer text-zinc-300 dark:text-zinc-500' />
              </div>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          onEscapeKeyDown={() => {
            setIsPopoverOpen(false)
            if (clearSearchOnClose) {
              setSearchValueState('')
              onSearch?.('')
            }
          }}
          {...{
            ...popoverOptions,
            className: cn('w-auto p-0', popoverOptions?.className),
            align: 'start',
            portal: popoverOptions?.portal,
          }}
        >
          <Command shouldFilter={!async}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValueState}
              onValueChange={(value: string) => {
                setSearchValueState(value)
                if (onSearch) {
                  onSearch(value)
                }
              }}
              onKeyDown={handleInputKeyDown}
            />
            <CommandList>
              {async && error && (
                <div className='text-destructive p-4 text-center'>{error.message}</div>
              )}
              {async ? (
                !loading &&
                !error &&
                options.length === 0 && (
                  <div className='pt-6 pb-4 text-center text-xs'>{`No result found.`}</div>
                )
              ) : (
                <CommandEmpty>{`No result found.`}</CommandEmpty>
              )}
              <CommandGroup>
                {!async && !hideSelectAll && (
                  <CommandItem key='all' onSelect={toggleAll} className='cursor-pointer'>
                    <div
                      className={cn(
                        'border-primary mr-1 flex size-4 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none',
                        selectedValues.length === options.length
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'opacity-50 [&_svg]:invisible'
                      )}
                    >
                      <CheckIcon className='size-3.5 text-white dark:text-black' />
                    </div>
                    <span>Select all</span>
                  </CommandItem>
                )}
                {options.map((option, index) => {
                  const isSelected = selectedValues.includes(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      className='cursor-pointer text-xs'
                    >
                      <div
                        className={cn(
                          'border-primary mr-1 flex size-4 items-center justify-center rounded-[4px] border shadow-xs transition-shadow outline-none',
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className='size-3.5 text-white dark:text-black' />
                      </div>
                      <>
                        {labelFunc ? (
                          labelFunc(option, isSelected, index)
                        ) : (
                          <span>{option.label}</span>
                        )}
                      </>
                    </CommandItem>
                  )
                })}

                {async && loading && (
                  <div className='flex h-full items-center justify-center'>
                    <Loadable isLoading />
                  </div>
                )}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className='flex items-center justify-between'>
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem
                        onSelect={handleClear}
                        className='flex-1 cursor-pointer justify-center'
                      >
                        {clearText}
                      </CommandItem>
                      <Separator orientation='vertical' className='flex h-full min-h-6' />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className='max-w-full flex-1 cursor-pointer justify-center'
                  >
                    {closeText}
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

MultiAsyncSelect.displayName = 'MultiAsyncSelect'
