import * as RadioGroup from '@radix-ui/react-radio-group'
import { Settings } from 'lucide-react'
import { IconCollapsibleIcon } from '@/assets/custom/icon-collapsible-icon'
import { IconCollapsibleOffcanvas } from '@/assets/custom/icon-collapsible-offcanvas'
import { IconLayoutFloating } from '@/assets/custom/icon-layout-floating'
import { IconLayoutInset } from '@/assets/custom/icon-layout-inset'
import { IconLayoutSidebar } from '@/assets/custom/icon-layout-sidebar'
import { cn } from '@/lib/utils'
import { Collapsible, useLayout } from '@/context/layout-context'
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
import { useSidebar } from './ui/sidebar'

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
          <CollapsibleConfig />
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

function CollapsibleConfig() {
  const { setOpen } = useSidebar()
  const { collapsible, setCollapsible } = useLayout()
  return (
    <div>
      <div className='text-muted-foreground mb-2 text-sm font-semibold'>
        Collapsible
      </div>
      <RadioGroup.Root
        value={collapsible}
        onValueChange={(v: Collapsible) => {
          setOpen(false)
          setTimeout(() => {
            setCollapsible(v)
          }, 100)
        }}
        className='grid w-full max-w-md grid-cols-3 gap-4'
      >
        {[
          {
            value: 'icon',
            label: 'Icon',
            icon: IconCollapsibleIcon,
          },
          {
            value: 'offcanvas',
            label: 'Offcanvas',
            icon: IconCollapsibleOffcanvas,
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
