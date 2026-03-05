import { useState, useMemo } from 'react'
import { Check, X, Search, Package, Folder, Library } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useProducts,
  useCategories,
  useCollections,
} from '@/hooks/queries/use-catalog'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Badge } from '@/components/ui/badge'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { SearchResultItem } from '../types'

interface UnifiedSearchPickerProps {
  value: SearchResultItem[]
  onChange: (items: SearchResultItem[]) => void
  placeholder?: string
  mode?: 'ALL' | 'PRODUCT_ONLY' | 'CATEGORY_ONLY'
}

export function UnifiedSearchPicker({
  value = [],
  onChange,
  placeholder = 'Search products, categories, or collections...',
  mode = 'ALL',
}: UnifiedSearchPickerProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const [searchMode, setSearchMode] = useState<
    'PRODUCT' | 'CATEGORY' | 'COLLECTION'
  >(mode === 'CATEGORY_ONLY' ? 'CATEGORY' : 'PRODUCT')

  // Fetch Data
  const { data: productsData } = useProducts()
  const { data: categoriesData } = useCategories()
  const { data: collectionsData } = useCollections()

  // Flatten Data
  const candidates: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = []

    if (mode !== 'CATEGORY_ONLY' && productsData?.data) {
      const productList = Array.isArray(productsData)
        ? productsData
        : productsData.data || []

      items.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...productList.map((p: any) => ({
          id: p.id,
          type: 'PRODUCT' as const,
          name: p.name?.en || 'Unnamed Product',
          price: typeof p.retailPrice === 'number' ? p.retailPrice : 0,
          subtitle: p.sku,
        }))
      )
    }

    if (mode !== 'PRODUCT_ONLY' && categoriesData) {
      const categoryList = Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData.data || []

      items.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...categoryList.map((c: any) => ({
          id: c.id,
          type: 'CATEGORY' as const,
          name: c.name?.en || 'Unnamed Category',
          subtitle: 'Category',
        }))
      )
    }

    if (
      mode !== 'PRODUCT_ONLY' &&
      mode !== 'CATEGORY_ONLY' &&
      collectionsData
    ) {
      const collectionList = Array.isArray(collectionsData)
        ? collectionsData
        : collectionsData.data || []

      items.push(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...collectionList.map((c: any) => ({
          id: c.id,
          type: 'COLLECTION' as const,
          name: c.name || 'Unnamed Collection',
          subtitle: 'Collection',
        }))
      )
    }

    return items
  }, [productsData, categoriesData, collectionsData, mode])

  const handleSelect = (item: SearchResultItem) => {
    const exists = value.find((v) => v.id === item.id)
    if (exists) return
    onChange([...value, item])
    setOpen(false)
  }

  const handleRemove = (id: string) => {
    onChange(value.filter((v) => v.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return <Package className='mr-3 h-5 w-5 text-muted-foreground/70' />
      case 'CATEGORY':
        return <Folder className='mr-3 h-5 w-5 text-muted-foreground/70' />
      case 'COLLECTION':
        return <Library className='mr-3 h-5 w-5 text-muted-foreground/70' />
      default:
        return <Package className='mr-3 h-5 w-5 text-muted-foreground/70' />
    }
  }

  const getSmallIcon = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return <Package className='h-3 w-3 opacity-50' />
      case 'CATEGORY':
        return <Folder className='h-3 w-3 opacity-50' />
      case 'COLLECTION':
        return <Library className='h-3 w-3 opacity-50' />
      default:
        return <Package className='h-3 w-3 opacity-50' />
    }
  }

  // --- Render Content for Picker ---
  const renderPickerContent = () => (
    <Command className={cn('h-auto rounded-lg border shadow-md')}>
      {!isDesktop && (
        <div className='flex items-center border-b px-4 py-2'>
          <Search className='mr-2 h-4 w-4 shrink-0 opacity-50' />
          <input
            className='flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50'
            placeholder={`Search ${searchMode.toLowerCase()}s...`}
          />
        </div>
      )}
      {isDesktop && (
        <div className='flex items-center border-b px-3'>
          <CommandInput
            placeholder={`Search ${searchMode.toLowerCase()}s...`}
            className='h-10'
          />
        </div>
      )}

      {/* Mode Toggles */}
      {mode === 'ALL' && (
        <div className='flex gap-1 border-b bg-muted/20 p-1'>
          <Button
            variant={searchMode === 'PRODUCT' ? 'secondary' : 'ghost'}
            size='sm'
            className='h-8 flex-1 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm'
            onClick={() => setSearchMode('PRODUCT')}
          >
            Products
          </Button>
          <Button
            variant={searchMode === 'CATEGORY' ? 'secondary' : 'ghost'}
            size='sm'
            className='h-8 flex-1 text-xs'
            onClick={() => setSearchMode('CATEGORY')}
          >
            Categories
          </Button>
          <Button
            variant={searchMode === 'COLLECTION' ? 'secondary' : 'ghost'}
            size='sm'
            className='h-8 flex-1 text-xs'
            onClick={() => setSearchMode('COLLECTION')}
          >
            Collections
          </Button>
        </div>
      )}

      <CommandList className='max-h-[300px] overflow-x-hidden overflow-y-auto'>
        <CommandEmpty className='py-6 text-center text-sm text-muted-foreground'>
          No results found.
        </CommandEmpty>
        <CommandGroup heading={searchMode}>
          {candidates
            .filter((c) => c.type === searchMode)
            .map((item) => (
              <CommandItem
                key={item.id}
                value={item.name + item.id}
                onSelect={() => handleSelect(item)}
                className='py-3'
              >
                <div
                  className={cn(
                    'mr-3 flex h-5 w-5 items-center justify-center rounded-full border',
                    value.find((v) => v.id === item.id)
                      ? 'border-primary bg-primary'
                      : 'opacity-50'
                  )}
                >
                  {value.find((v) => v.id === item.id) && (
                    <Check className='h-3 w-3 text-primary-foreground' />
                  )}
                </div>
                {getIcon(item.type)}
                <div className='flex flex-col'>
                  <span className='font-medium'>{item.name}</span>
                  {item.subtitle && (
                    <span className='text-[11px] text-muted-foreground'>
                      {item.subtitle}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  return (
    <div className='flex flex-col gap-3'>
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen} modal>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='h-10 w-full justify-between bg-muted/5 px-3'
            >
              <span className='truncate text-sm text-muted-foreground'>
                {value.length > 0 ? `${value.length} selected` : placeholder}
              </span>
              <Search className='ml-2 h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[400px] p-0' align='start'>
            {renderPickerContent()}
          </PopoverContent>
        </Popover>
      ) : (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='h-12 w-full justify-between border-2 border-dashed bg-muted/5 px-4 text-base'
            >
              <span className='truncate text-muted-foreground'>
                {value.length > 0 ? `${value.length} items` : placeholder}
              </span>
              <Search className='ml-2 h-5 w-5 opacity-50' />
            </Button>
          </SheetTrigger>
          <SheetContent
            side='bottom'
            className='flex h-[90vh] flex-col rounded-t-xl p-0'
          >
            <SheetHeader className='border-b px-4 py-3'>
              <SheetTitle className='text-left text-base'>
                Select Targets
              </SheetTitle>
            </SheetHeader>
            <div className='flex flex-1 flex-col overflow-hidden'>
              {renderPickerContent()}
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Selected Items Chips */}
      {value.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {value.map((item) => (
            <Badge
              key={item.id}
              variant='secondary'
              className='h-7 animate-in gap-1 pr-1 pl-2 zoom-in-95 fade-in'
            >
              {getSmallIcon(item.type)}
              {item.name}
              <Button
                variant='ghost'
                size='icon'
                className='ml-1 h-4 w-4 rounded-full p-0 hover:bg-muted-foreground/20'
                onClick={() => handleRemove(item.id)}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
