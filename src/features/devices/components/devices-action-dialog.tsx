'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { deviceTypesList } from '../data/data'
import { Device, DeviceStatus } from '../data/schema'

// Device status list
const deviceStatusList: { label: string; value: DeviceStatus }[] = [
  { label: 'In Use', value: 'in_use' },
  { label: 'In Store', value: 'in_store' },
  { label: 'Allocated', value: 'allocated' },
  { label: 'Assigned', value: 'assigned' },
  { label: 'Disposed', value: 'disposed' },
  { label: 'Fault', value: 'fault' },
]

// Zod form schema
const formSchema = z.object({
  device_name: z.string().min(1, { message: 'Device Name is required.' }),
  serial_number: z.string().min(1, { message: 'Serial Number is required.' }),
  brand: z.string().min(1, { message: 'Brand is required.' }),
  model: z.string().min(1, { message: 'Model is required.' }),
  processor: z.coerce.number().int().min(1, { message: 'Processor cores are required.' }),
  RAM: z.coerce.number().int().min(1, { message: 'RAM is required.' }),
  storage: z.coerce.number().int().min(1, { message: 'Storage is required.' }),
  mac_address: z.string().min(1, { message: 'MAC address is required.' }),
  year_of_purchase: z.coerce.number().int().min(2000, { message: 'Year of purchase is required.' }),
  status: z.string(),
  device_type: z.string(),
  isEdit: z.boolean(),
})

type DeviceForm = z.infer<typeof formSchema>

interface Props {
  currentRow?: Device
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeviceActionDialog({ currentRow, open, onOpenChange }: Props) {
  const isEdit = !!currentRow
  const form = useForm<DeviceForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
        ...currentRow,
        isEdit,
      }
      : {
        device_name: '',
        serial_number: '',
        brand: '',
        model: '',
        processor: 4,
        RAM: 8,
        storage: 256,
        mac_address: '',
        year_of_purchase: new Date().getFullYear(),
        status: '',
        device_type: '',
        isEdit,
      },
  })

  const onSubmit = (values: DeviceForm) => {
    form.reset()
    showSubmittedData(values)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit Device' : 'Add New Device'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the device here. ' : 'Create a new device here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='device-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='device_name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Device Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Latitude 5430'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='serial_number'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Serial Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='SN123456789'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='brand'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Brand
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Dell'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='model'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Model
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='5430'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='processor'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Processor (Cores)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='4'
                        className='col-span-4'
                        {...field}
                        min={1}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='RAM'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      RAM (GB)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='8'
                        className='col-span-4'
                        {...field}
                        min={1}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='storage'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Storage (GB)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='256'
                        className='col-span-4'
                        {...field}
                        min={1}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='mac_address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      MAC Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='00:1B:44:11:3A:B7'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='year_of_purchase'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Year of Purchase
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='2024'
                        className='col-span-4'
                        {...field}
                        min={2000}
                        max={new Date().getFullYear()}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='device_type'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Device Type
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a type'
                      className='col-span-4'
                      items={deviceTypesList.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Status
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select a status'
                      className='col-span-4'
                      items={deviceStatusList.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='device-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
