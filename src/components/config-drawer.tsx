import * as RadioGroup from '@radix-ui/react-radio-group'
import { Settings } from 'lucide-react'
import { IconLayoutFloating } from '@/assets/custom/icon-layout-floating'
import { IconLayoutInset } from '@/assets/custom/icon-layout-inset'
import { IconLayoutSidebar } from '@/assets/custom/icon-layout-sidebar'
import { cn } from '@/lib/utils'
import { useLayout } from '@/context/layout-context'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export function ConfigDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size='icon' variant='ghost'>
          <Settings className='' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>Theme config</SheetTitle>
          <SheetDescription>Theme config description</SheetDescription>
        </SheetHeader>
        <div className='space-y-6 p-4'>
          <LayoutConfig />
          {/* <div>
            <h2 className='mt-4 mb-2'>Collapsible</h2>
            <RadioGroup value={collapsible} onValueChange={setCollapsible}>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='icon' id='icon' />
                <Label htmlFor='icon'>Icon</Label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='offcanvas' id='offcanvas' />
                <Label htmlFor='offcanvas'>Offcanvas</Label>
              </div>
            </RadioGroup>
          </div> */}
        </div>
        <SheetFooter className='gap-2'>
          <Button variant='destructive' type='submit'>
            Reset
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function LayoutConfig() {
  const { variant, setVariant } = useLayout()
  return (
    <div>
      <div className='text-muted-foreground mb-2 text-sm font-semibold'>
        Layout
      </div>
      <RadioGroup.Root
        value={variant}
        onValueChange={setVariant}
        className='grid w-full max-w-md grid-cols-3 gap-4'
      >
        {[
          {
            value: 'inset',
            label: 'Inset',
            icon: IconLayoutInset,
          },
          {
            value: 'floating',
            label: 'Floating',
            icon: IconLayoutFloating,
          },
          {
            value: 'sidebar',
            label: 'Sidebar',
            icon: IconLayoutSidebar,
          },
        ].map((option) => (
          <RadioGroup.Item
            key={option.value}
            value={option.value}
            className={cn(
              'group',
              'transition duration-200 ease-in',
              'ring-border rounded-[6px] ring-[1px]',
              'data-[state=checked]:ring-primary data-[state=checked]:shadow-2xl'
            )}
          >
            <option.icon className='stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground mask-clip-border' />
            <span className='sr-only'>{option.label}</span>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  )
}
