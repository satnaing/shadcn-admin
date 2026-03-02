import { type ShopIngredient } from '@/types/inventory'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { InventoryForm, type InventoryFormValues } from './inventory-form'

export function InventorySheet({
  open,
  onOpenChange,
  item,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ShopIngredient | null
}) {
  const handleSubmit = (data: InventoryFormValues) => {
    // eslint-disable-next-line no-console
    console.log('New Item Created:', data)
    // Here we would typically call an API
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='p-4 sm:max-w-xl'>
        <SheetHeader>
          <SheetTitle>Stock Settings</SheetTitle>
          <SheetDescription>
            Update the low stock threshold for this ingredient.
          </SheetDescription>
        </SheetHeader>
        <div className='mt-6'>
          <InventoryForm onSubmit={handleSubmit} initialData={item} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
