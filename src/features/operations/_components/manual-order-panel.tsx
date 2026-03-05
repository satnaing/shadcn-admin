import { useState } from 'react'
import { type CreateOrderItemDto, type Product } from '@/types/api'
import {
  Plus,
  Search,
  X,
  ShoppingCart,
  Loader2,
  Utensils,
  Bike,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'
import { useProducts, useCategories } from '@/hooks/queries/use-catalog'
import { useCustomers } from '@/hooks/queries/use-customers'
import { useCreateOrder } from '@/hooks/queries/use-orders'
import { useShopFulfillmentMethods } from '@/hooks/queries/use-shops'
import { useAppStore } from '@/hooks/use-app-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type Category } from '@/features/menu/data/schema'

interface CartItem extends CreateOrderItemDto {
  name: string
  tempId: string
  imageUrl?: string
  displayOptions?: string[]
}

export function ManualOrderPanel() {
  const [open, setOpen] = useState(false)
  const shopId = useAppStore((state) => state.activeShopId)
  const { mutate: createOrder, isPending: isCommiting } = useCreateOrder()

  // Selection state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedVariantId, setSelectedVariantId] = useState<string>('')
  const [selectedModifiers, setSelectedModifiers] = useState<
    Record<string, string>
  >({})

  // Panel State
  const [isGuest, setIsGuest] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: string
    name: string
  } | null>(null)
  const [orderType, setOrderType] = useState<'DINE_IN' | 'TAKEAWAY'>('TAKEAWAY')
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')

  // Queries
  const { data: customersData } = useCustomers({
    search: searchQuery,
    limit: 5,
  })
  const { data: categoriesData } = useCategories()
  const categories = categoriesData?.data || []
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    categoryId: activeCategoryId !== 'all' ? activeCategoryId : undefined,
    limit: 50,
  })
  const { data: fulfillmentMethods } = useShopFulfillmentMethods(
    shopId || undefined
  )

  const customers = customersData?.data || []
  const products = productsData?.data || []

  // Handlers
  const openProductSelector = (product: Product) => {
    setSelectedProduct(product)
    // Default to first variant
    const firstVariant = product.price?.choices?.[0]
    setSelectedVariantId(firstVariant?.id || firstVariant?.sku || '')
    // Default modifiers
    const defaults: Record<string, string> = {}
    product.optionGroups?.forEach((group) => {
      const defaultChoice =
        group.choices?.find((c) => c.isDefault) || group.choices?.[0]
      if (defaultChoice) defaults[group.id] = defaultChoice.id
    })
    setSelectedModifiers(defaults)
  }

  const handleAddToCart = () => {
    if (!selectedProduct) return

    const variant = selectedProduct.price?.choices?.find(
      (c) => c.id === selectedVariantId || c.sku === selectedVariantId
    )
    if (!variant) return

    const basePrice =
      typeof variant.price === 'string'
        ? parseFloat(variant.price)
        : variant.price

    // Calculate modifiers price
    let modifiersPrice = 0
    const displayOptions: string[] = []
    const selectedChoiceIds: string[] = []

    // Add variant ID
    selectedChoiceIds.push(variant.id || variant.sku)
    displayOptions.push(variant.name.en)

    // Add selected modifiers
    selectedProduct.optionGroups?.forEach((group) => {
      const choiceId = selectedModifiers[group.id]
      const choice = group.choices?.find((c) => c.id === choiceId)
      if (choice) {
        const p =
          typeof choice.price === 'string'
            ? parseFloat(choice.price)
            : choice.price
        modifiersPrice += p
        selectedChoiceIds.push(choice.id)
        displayOptions.push(`${group.name.en}: ${choice.name.en}`)
      }
    })

    const finalUnitPrice = basePrice + modifiersPrice

    const newItem: CartItem = {
      tempId: crypto.randomUUID(),
      productId: selectedProduct.id,
      name: selectedProduct.name.en,
      imageUrl: selectedProduct.imageUrl?.en,
      quantity: 1,
      unitPrice: finalUnitPrice,
      options: {
        choiceId: selectedChoiceIds,
      },
      displayOptions,
    }

    setCartItems((prev) => [...prev, newItem])
    setSelectedProduct(null)
    toast.success(`${selectedProduct.name.en} added`)
  }

  const handleRemoveItem = (tempId: string) => {
    setCartItems((prev) => prev.filter((i) => i.tempId !== tempId))
  }

  const handleCommit = () => {
    if (!shopId) return toast.error('No active shop context')
    if (cartItems.length === 0) return toast.error('Cart is empty')

    // Generate unique codes for this session
    const timestamp = Date.now()
    const invoiceCode = `POS-${shopId.slice(0, 4)}-${timestamp}`
    const queueNumber = Math.floor(Math.random() * 900) + 100 // Proper integer for POS queue

    // Map orderType to actual UUID from the backend config
    const method = fulfillmentMethods?.find(
      (m) => m.category === orderType && m.isEnabled
    )
    if (!method) {
      return toast.error(
        `Fulfillment method ${orderType} is currently unavailable`
      )
    }

    createOrder(
      {
        shopId,
        userId: isGuest ? null : selectedCustomer?.id,
        guestInfo: isGuest ? { name: 'Guest Walk-in' } : undefined,
        items: cartItems.map(
          ({ tempId, name, imageUrl, displayOptions, ...item }) => item
        ),
        fulfillmentMethodId: method.id,
        status: 'CONFIRMED', // Initial status required by spec
        invoiceCode,
        queueNumber,
        customerName: isGuest && customerName ? customerName : undefined,
        customerPhone: isGuest && customerPhone ? customerPhone : undefined,
        assignToSelf: true, // Auto-assign to current staff
      },
      {
        onSuccess: () => {
          toast.success('Order committed to KDS')
          setOpen(false)
          setCartItems([])
          setIsGuest(true)
          setSelectedCustomer(null)
          setSearchQuery('')
          setCustomerName('')
          setCustomerPhone('')
        },
        onError: (err: any) => {
          const detail = err.response?.data?.message || 'Failed to commit order'
          toast.error(detail)
        },
      }
    )
  }

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant='default'
          className='shadow-md transition-all duration-300 hover:shadow-primary/10'
        >
          <Plus className='mr-2 h-4 w-4' />
          New Order
        </Button>
      </SheetTrigger>
      <SheetContent className='flex w-full flex-col gap-0 border-l-0 p-0 shadow-xl sm:max-w-2xl md:max-w-4xl lg:max-w-[1100px]'>
        <SheetHeader className='bg-primary px-6 py-5 text-primary-foreground select-none'>
          <div className='flex items-center justify-between'>
            <SheetTitle className='text-xl font-bold tracking-tight text-white uppercase'>
              Manual Order Entry
            </SheetTitle>
            <div className='flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md'>
              <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-green-400' />
              Live POS
            </div>
          </div>
        </SheetHeader>

        <div className='flex flex-1 overflow-hidden bg-[#F8F9FB]'>
          {/* Main Content */}
          <div className='flex flex-1 flex-col overflow-hidden'>
            <div className='z-10 bg-white px-6 py-4 shadow-sm'>
              <div className='flex flex-wrap items-center justify-between gap-6'>
                <div className='min-w-[240px] flex-1'>
                  <Label className='mb-2 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                    Service Type
                  </Label>
                  <Tabs
                    value={orderType}
                    onValueChange={(val) =>
                      setOrderType(val as 'DINE_IN' | 'TAKEAWAY')
                    }
                    className='w-full'
                  >
                    <TabsList className='grid h-10 w-full grid-cols-2 bg-muted/30 p-1'>
                      <TabsTrigger
                        value='DINE_IN'
                        className='gap-2 rounded-md text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm'
                      >
                        <Utensils className='h-3.5 w-3.5' />
                        Dine-in
                      </TabsTrigger>
                      <TabsTrigger
                        value='TAKEAWAY'
                        className='gap-2 rounded-md text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm'
                      >
                        <Bike className='h-3.5 w-3.5' />
                        Takeaway
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className='min-w-[300px] flex-[1.5]'>
                  <div className='mb-2 flex items-center justify-between'>
                    <Label className='block text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                      Customer Context
                    </Label>
                    <div className='flex items-center space-x-3'>
                      <Label
                        htmlFor='guest-mode'
                        className='text-[10px] font-bold text-muted-foreground uppercase'
                      >
                        Guest Mode
                      </Label>
                      <Switch
                        id='guest-mode'
                        className='h-5 w-9 data-[state=checked]:bg-primary'
                        checked={isGuest}
                        onCheckedChange={setIsGuest}
                      />
                    </div>
                  </div>

                  {!isGuest && (
                    <div className='relative animate-in fade-in slide-in-from-top-1'>
                      {selectedCustomer ? (
                        <div className='flex h-10 items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-4'>
                          <div className='flex items-center gap-2'>
                            <div className='h-1.5 w-1.5 rounded-full bg-primary' />
                            <span className='text-xs font-bold text-primary'>
                              {selectedCustomer.name}
                            </span>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-6 w-6 text-primary hover:bg-primary/10'
                            onClick={() => setSelectedCustomer(null)}
                          >
                            <X className='h-3 w-3' />
                          </Button>
                        </div>
                      ) : (
                        <div className='group relative'>
                          <Search className='absolute top-3 left-3.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary' />
                          <Input
                            placeholder='Search loyalty member...'
                            className='h-10 border pl-10 text-xs transition-all focus-visible:border-primary focus-visible:ring-0'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {searchQuery && customers.length > 0 && (
                            <Card className='absolute top-full z-50 mt-1 w-full overflow-hidden border shadow-lg'>
                              <CardContent className='p-0'>
                                {customers.map((c) => (
                                  <div
                                    key={c.id}
                                    className='flex cursor-pointer items-center justify-between border-b px-4 py-2 transition-colors last:border-0 hover:bg-primary/5'
                                    onClick={() => {
                                      setSelectedCustomer({
                                        id: c.id,
                                        name: c.fullName || c.phone,
                                      })
                                      setSearchQuery('')
                                    }}
                                  >
                                    <div>
                                      <div className='text-xs font-bold text-foreground'>
                                        {c.fullName || 'No Name'}
                                      </div>
                                      <div className='text-[10px] font-semibold text-primary'>
                                        {c.phone}
                                      </div>
                                    </div>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      className='h-6 text-[10px] font-bold'
                                    >
                                      Select
                                    </Button>
                                  </div>
                                ))}
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {isGuest && (
                    <div className='grid animate-in grid-cols-2 gap-3 fade-in slide-in-from-top-1'>
                      <div className='relative'>
                        <Input
                          placeholder='Customer Name'
                          className='h-10 border text-xs transition-all focus-visible:border-primary focus-visible:ring-0'
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      <div className='relative'>
                        <Input
                          placeholder='Phone Number'
                          className='h-10 border text-xs transition-all focus-visible:border-primary focus-visible:ring-0'
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className='flex flex-1 overflow-hidden'>
              <div className='w-48 overflow-y-auto border-r bg-white pt-4 pb-12 select-none'>
                <div className='mb-4 px-5'>
                  <h3 className='mb-2 text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase'>
                    Categories
                  </h3>
                </div>
                <div className='space-y-0.5'>
                  <button
                    className={cn(
                      'group relative flex w-full items-center justify-between overflow-hidden px-6 py-3.5 transition-all',
                      activeCategoryId === 'all'
                        ? 'border-r-2 border-primary bg-primary/5 font-bold text-primary'
                        : 'font-semibold text-muted-foreground hover:bg-muted/30'
                    )}
                    onClick={() => setActiveCategoryId('all')}
                  >
                    <span className='truncate text-[13px]'>All Menu</span>
                  </button>
                  {categories.map((cat: Category) => (
                    <button
                      key={cat.id}
                      className={cn(
                        'group relative flex w-full items-center justify-between overflow-hidden px-6 py-3.5 transition-all',
                        activeCategoryId === cat.id
                          ? 'border-r-2 border-primary bg-primary/5 font-bold text-primary'
                          : 'font-semibold text-muted-foreground hover:bg-muted/30'
                      )}
                      onClick={() => setActiveCategoryId(cat.id!)}
                    >
                      <span className='truncate text-[13px]'>
                        {cat.name.en}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className='flex-1 overflow-y-auto bg-white/40 p-6'>
                {isLoadingProducts ? (
                  <div className='flex h-full flex-col items-center justify-center space-y-4'>
                    <Loader2 className='h-8 w-8 animate-spin text-primary opacity-30' />
                  </div>
                ) : products.length === 0 ? (
                  <div className='flex h-full items-center justify-center text-center opacity-40'>
                    <p className='text-xs font-bold'>
                      No product matches for this category.
                    </p>
                  </div>
                ) : (
                  <div className='grid grid-cols-2 content-start gap-4 pb-20 lg:grid-cols-3 xl:grid-cols-4'>
                    {products.map((product: Product) => (
                      <Card
                        key={product.id}
                        className='group cursor-pointer overflow-hidden border-transparent bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md active:scale-[0.98]'
                        onClick={() => openProductSelector(product)}
                      >
                        <CardContent className='p-0'>
                          <div className='aspect-square overflow-hidden bg-muted'>
                            {product.imageUrl?.en ? (
                              <img
                                src={product.imageUrl.en}
                                alt={product.name.en}
                                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                              />
                            ) : (
                              <div className='flex h-full w-full items-center justify-center text-[10px] font-bold tracking-tighter text-muted-foreground/30 uppercase italic'>
                                No Image
                              </div>
                            )}
                          </div>
                          <div className='p-3 text-center'>
                            <h4 className='mb-1 truncate px-1 text-xs leading-tight font-bold text-foreground/80'>
                              {product.name.en}
                            </h4>
                            <div className='text-[11px] font-bold text-primary'>
                              {formatCurrency(
                                typeof product.price?.choices?.[0]?.price ===
                                  'string'
                                  ? parseFloat(product.price.choices[0].price)
                                  : product.price?.choices?.[0]?.price || 0
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart Section */}
          <div className='z-20 flex w-[340px] flex-col border-l bg-white shadow-sm'>
            <div className='flex h-16 items-center justify-between border-b px-6'>
              <div className='flex items-center gap-2'>
                <ShoppingCart className='h-4 w-4 text-primary' />
                <h3 className='text-xs font-bold tracking-wider uppercase'>
                  Active Order
                </h3>
                {cartItems.length > 0 && (
                  <span className='flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white'>
                    {cartItems.length}
                  </span>
                )}
              </div>
            </div>

            <div className='flex-1 overflow-y-auto px-4 py-4'>
              {cartItems.length === 0 ? (
                <div className='flex h-full flex-col items-center justify-center text-center opacity-30'>
                  <p className='text-[11px] leading-relaxed font-bold tracking-widest uppercase'>
                    Order list is empty
                  </p>
                </div>
              ) : (
                <div className='space-y-2.5'>
                  {cartItems.map((item) => (
                    <div
                      key={item.tempId}
                      className='group flex items-center gap-3 rounded-lg border border-transparent bg-muted/20 p-2.5 transition-all hover:border-muted-foreground/10'
                    >
                      <div className='h-10 w-10 shrink-0 overflow-hidden rounded border bg-background'>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            className='h-full w-full object-cover'
                            alt=''
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center text-[8px] font-bold opacity-20'>
                            N/A
                          </div>
                        )}
                      </div>
                      <div className='min-w-0 flex-1'>
                        <div className='mb-0.5 flex items-center justify-between'>
                          <span className='max-w-[140px] truncate text-[11px] font-bold text-foreground'>
                            {item.name}
                          </span>
                          <span className='text-[11px] font-bold text-primary'>
                            {formatCurrency(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <span className='rounded bg-muted-foreground/10 px-1 text-[9px] font-bold text-muted-foreground'>
                            x{item.quantity}
                          </span>
                          {item.displayOptions &&
                            item.displayOptions.length > 0 && (
                              <span className='truncate text-[9px] text-muted-foreground italic'>
                                {item.displayOptions.join(', ')}
                              </span>
                            )}
                        </div>
                      </div>
                      <button
                        className='h-6 w-6 rounded-full text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:text-destructive'
                        onClick={() => handleRemoveItem(item.tempId)}
                      >
                        <X className='h-3.5 w-3.5' />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className='border-t border-primary/20 bg-card p-6'>
              <div className='mb-6 space-y-1'>
                <div className='flex items-center justify-between text-[11px] font-semibold text-muted-foreground'>
                  <span>Subtotal</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                <div className='flex items-center justify-between border-t border-dashed pt-4'>
                  <span className='text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                    Total Payable
                  </span>
                  <span className='font-mono text-2xl font-bold tracking-tight text-primary'>
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
              <Button
                size='lg'
                className='h-14 w-full text-sm font-bold tracking-widest uppercase'
                onClick={handleCommit}
                disabled={isCommiting || cartItems.length === 0}
              >
                {isCommiting ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : (
                  'Confirm Order'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Product Option Dialog */}
        <Dialog
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        >
          <DialogContent className='sm:max-w-md'>
            <DialogHeader>
              <DialogTitle className='text-base font-bold tracking-tight uppercase'>
                {selectedProduct?.name.en}
              </DialogTitle>
            </DialogHeader>
            <div className='grid gap-6 py-4'>
              {/* Variants (Price Groups) */}
              {selectedProduct?.price?.choices && (
                <div className='space-y-3'>
                  <Label className='text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                    Selection
                  </Label>
                  <div className='grid grid-cols-2 gap-2'>
                    {selectedProduct.price.choices.map((choice) => {
                      const id = choice.id || choice.sku
                      const isSelected = selectedVariantId === id
                      return (
                        <button
                          key={id}
                          className={cn(
                            'flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all',
                            isSelected
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-muted hover:border-muted-foreground/30'
                          )}
                          onClick={() => setSelectedVariantId(id)}
                        >
                          <div className='flex flex-col'>
                            <span className='text-xs font-bold'>
                              {choice.name.en}
                            </span>
                            <span className='text-[10px] opacity-70'>
                              {formatCurrency(
                                typeof choice.price === 'string'
                                  ? parseFloat(choice.price)
                                  : choice.price
                              )}
                            </span>
                          </div>
                          {isSelected && <Check className='h-4 w-4' />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Modifiers */}
              {selectedProduct?.optionGroups?.map((group) => (
                <div key={group.id} className='space-y-3'>
                  <Label className='text-[10px] font-bold tracking-widest text-muted-foreground uppercase'>
                    {group.name.en}{' '}
                    {group.minSelect > 0 && (
                      <span className='text-destructive'>*</span>
                    )}
                  </Label>
                  <div className='grid grid-cols-2 gap-2'>
                    {group.choices?.map((choice) => {
                      const isSelected =
                        selectedModifiers[group.id] === choice.id
                      return (
                        <button
                          key={choice.id}
                          className={cn(
                            'flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all',
                            isSelected
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-muted hover:border-muted-foreground/30'
                          )}
                          onClick={() =>
                            setSelectedModifiers((prev) => ({
                              ...prev,
                              [group.id]: choice.id,
                            }))
                          }
                        >
                          <div className='flex flex-col'>
                            <span className='text-xs font-bold'>
                              {choice.name.en}
                            </span>
                            {(typeof choice.price === 'string'
                              ? parseFloat(choice.price)
                              : choice.price) > 0 && (
                              <span className='text-[10px] opacity-70'>
                                +
                                {formatCurrency(
                                  typeof choice.price === 'string'
                                    ? parseFloat(choice.price)
                                    : choice.price
                                )}
                              </span>
                            )}
                          </div>
                          {isSelected && <Check className='h-4 w-4' />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button
                className='h-12 w-full font-bold tracking-widest uppercase'
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  )
}
