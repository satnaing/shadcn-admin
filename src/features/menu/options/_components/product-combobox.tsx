import * as React from 'react'
import type { Product } from '@/types/api'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProducts } from '@/hooks/queries/use-catalog'
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

interface ProductComboboxProps {
  value?: string
  onSelect: (product: Product) => void
  placeholder?: string
}

export function ProductCombobox({
  value,
  onSelect,
  placeholder = 'Select product...',
}: ProductComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const { data: productsData, isLoading } = useProducts()

  const products = React.useMemo(() => {
    return productsData?.data || []
  }, [productsData])

  const selectedProduct = React.useMemo(() => {
    return products.find((p) => p.id === value)
  }, [products, value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between'
        >
          {selectedProduct ? (
            <span className='truncate'>{selectedProduct.name.en}</span>
          ) : (
            <span className='text-muted-foreground'>{placeholder}</span>
          )}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search products...' />
          <CommandList>
            <CommandEmpty>
              {isLoading ? 'Loading products...' : 'No product found.'}
            </CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.name.en + product.sku}
                  onSelect={() => {
                    onSelect(product)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === product.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className='flex flex-col'>
                    <span>{product.name.en}</span>
                    <span className='text-xs text-muted-foreground'>
                      {product.sku}
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
