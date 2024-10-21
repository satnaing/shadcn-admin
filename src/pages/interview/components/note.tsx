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
import { useFormContext } from 'react-hook-form'

export function Note() {
  const { register } = useFormContext()
  return (
    <Drawer>
      <DrawerTrigger>
        <Button>Note</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerDescription>
            <Textarea
              {...register('note')}
              placeholder='Type your note here...'
              className='min-h-80'
            ></Textarea>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <div className='flex w-full justify-center gap-4'>
            <Button type='button'>Clear</Button>
            <DrawerClose>
              <Button variant='outline'>Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
