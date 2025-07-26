import { SVGProps } from 'react'
import { Root as Radio, Item } from '@radix-ui/react-radio-group'
import { CircleCheck, Settings } from 'lucide-react'
import { IconCollapsibleIcon } from '@/assets/custom/icon-collapsible-icon'
import { IconCollapsibleOffcanvas } from '@/assets/custom/icon-collapsible-offcanvas'
import { IconDir } from '@/assets/custom/icon-dir'
import { IconLayoutFloating } from '@/assets/custom/icon-layout-floating'
import { IconLayoutInset } from '@/assets/custom/icon-layout-inset'
import { IconLayoutSidebar } from '@/assets/custom/icon-layout-sidebar'
import { IconThemeDark } from '@/assets/custom/icon-theme-dark'
import { IconThemeLight } from '@/assets/custom/icon-theme-light'
import { cn } from '@/lib/utils'
import { useDirection } from '@/context/direction-context'
import { Collapsible, useLayout } from '@/context/layout-context'
import { useTheme } from '@/context/theme-context'
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
          <Settings />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription>
            Adjust the appearance and layout to suit your preferences.
          </SheetDescription>
        </SheetHeader>
        <div className='space-y-6 px-4'>
          <LayoutConfig />
          <CollapsibleConfig />
          <DirConfig />
          <ThemeConfig />
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

function RadioGroupItem({
  item,
  isTheme = false,
}: {
  item: {
    value: string
    label: string
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
  }
  isTheme?: boolean
}) {
  return (
    <Item
      value={item.value}
      className={cn('group outline-none', 'transition duration-200 ease-in')}
    >
      <div
        className={cn(
          'ring-border relative rounded-[6px] ring-[1px]',
          'group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl',
          'group-focus-visible:ring-2'
        )}
      >
        <CircleCheck
          className={cn(
            'fill-primary size-6 stroke-white',
            'group-data-[state=unchecked]:hidden',
            'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2'
          )}
        />
        <item.icon
          className={cn(
            !isTheme &&
              'stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground'
          )}
        />
      </div>
      <div className='mt-1 text-xs'>{item.label}</div>
    </Item>
  )
}

function LayoutConfig() {
  const { variant, setVariant } = useLayout()
  return (
    <div>
      <div className='text-muted-foreground mb-2 text-sm font-semibold'>
        Layout
      </div>
      <Radio
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
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
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
      <Radio
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
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
    </div>
  )
}

function DirConfig() {
  const { dir, setDir } = useDirection()
  return (
    <div>
      <div className='text-muted-foreground mb-2 text-sm font-semibold'>
        Direction
      </div>
      <Radio
        value={dir}
        onValueChange={setDir}
        className='grid w-full max-w-md grid-cols-3 gap-4'
      >
        {[
          {
            value: 'ltr',
            label: 'Left to Right',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='ltr' {...props} />
            ),
          },
          {
            value: 'rtl',
            label: 'Right to Left',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='rtl' {...props} />
            ),
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </Radio>
    </div>
  )
}

function ThemeConfig() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <div>
      <div className='text-muted-foreground mb-2 text-sm font-semibold'>
        Theme
      </div>
      <Radio
        value={resolvedTheme}
        onValueChange={setTheme}
        className='grid w-full max-w-md grid-cols-3 gap-4'
      >
        {[
          {
            value: 'light',
            label: 'Light',
            icon: IconThemeLight,
          },
          {
            value: 'dark',
            label: 'Dark',
            icon: IconThemeDark,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </Radio>
    </div>
  )
}
