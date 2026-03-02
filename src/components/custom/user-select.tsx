import * as React from 'react'
import type { Customer } from '@/types/growth'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCustomers } from '@/hooks/queries/use-customers'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface UserSelectProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
}

export function UserSelect({
  value,
  onChange,
  placeholder = 'Select user...',
}: UserSelectProps) {
  const [open, setOpen] = React.useState(false)
  const { data: customersResponse } = useCustomers()
  const customers = (customersResponse?.data as Customer[]) || []

  const selectedUser = customers.find((customer) => customer.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
        >
          {selectedUser
            ? `${selectedUser.fullName} (${selectedUser.phone})`
            : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[--radix-popover-trigger-width] p-0'>
        <Command>
          <CommandInput placeholder='Search user by name or phone...' />
          <CommandList>
            <CommandEmpty>No user found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value='none'
                onSelect={() => {
                  onChange('')
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    !value ? 'opacity-100' : 'opacity-0'
                  )}
                />
                None
              </CommandItem>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={`${customer.fullName} ${customer.phone}`}
                  onSelect={() => {
                    onChange(customer.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === customer.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className='flex flex-col text-left'>
                    <span>{customer.fullName}</span>
                    <span className='text-xs text-muted-foreground'>
                      {customer.phone}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
