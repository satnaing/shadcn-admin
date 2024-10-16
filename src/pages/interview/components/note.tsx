import { Button } from '@/components/custom/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Textarea } from '@/components/ui/textarea'

export function Note() {
  return (
    <Drawer>
      <DrawerTrigger>
        <Button>Note</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerDescription>
            <Textarea
              placeholder='Type your note here...'
              className='min-h-80'
            ></Textarea>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <div className='flex w-full justify-center gap-4'>
            <Button>Save</Button>
            <DrawerClose>
              <Button variant='outline'>Cancel</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
