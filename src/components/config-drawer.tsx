import { Settings } from 'lucide-react'
import { useLayout } from '@/context/layout-context'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
  const { variant, setVariant, collapsible, setCollapsible } = useLayout()
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
        <div className='p-4'>
          <div>
            <h2 className='mb-2'>Sidebar</h2>
            <RadioGroup value={variant} onValueChange={setVariant}>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='inset' id='inset' />
                <Label htmlFor='inset'>Inset</Label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='floating' id='floating' />
                <Label htmlFor='floating'>Float</Label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='sidebar' id='sidebar' />
                <Label htmlFor='sidebar'>Sidebar</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
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
          </div>
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
