import { SVGProps } from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Settings } from 'lucide-react'
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
          <Settings className='' />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>Theme Settings</SheetTitle>
          <SheetDescription>
            Customize theme settings to match preference.
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

function DirConfig() {
  const { dir, setDir } = useDirection()
  return (
    <div>
      <div className='text-muted-foreground mb-2 text-sm font-semibold'>
        Direction
      </div>
      <RadioGroup.Root
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
        ].map((option) => (
          <RadioGroup.Item
            key={option.value}
            value={option.value}
            className={cn('group', 'transition duration-200 ease-in')}
          >
            <div
              className={cn(
                'ring-border rounded-[6px] ring-[1px]',
                'group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl'
              )}
            >
              <option.icon className='stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground' />
            </div>
            <div className='mt-1 text-xs'>{option.label}</div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  )
}

function ThemeConfig() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <div className='text-muted-foreground mb-2 text-sm font-semibold'>
        Theme
      </div>
      <RadioGroup.Root
        value={theme}
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
        ].map((option) => (
          <RadioGroup.Item
            key={option.value}
            value={option.value}
            className={cn('group', 'transition duration-200 ease-in')}
          >
            <div
              className={cn(
                'ring-border rounded-[6px] ring-[1px]',
                'group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl'
              )}
            >
              <option.icon />
            </div>
            <div className='mt-1 text-xs'>{option.label}</div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
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
            className={cn('group', 'transition duration-200 ease-in')}
          >
            <div
              className={cn(
                'ring-border rounded-[6px] ring-[1px]',
                'group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl'
              )}
            >
              <option.icon className='stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground' />
            </div>
            <div className='mt-1 text-xs'>{option.label}</div>
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
            className={cn('group', 'transition duration-200 ease-in')}
          >
            <div
              className={cn(
                'ring-border rounded-[6px] ring-[1px]',
                'group-data-[state=checked]:ring-primary group-data-[state=checked]:shadow-2xl'
              )}
            >
              <option.icon className='stroke-primary fill-primary group-data-[state=unchecked]:stroke-muted-foreground group-data-[state=unchecked]:fill-muted-foreground' />
            </div>
            <div className='mt-1 text-xs'>{option.label}</div>
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </div>
  )
}
