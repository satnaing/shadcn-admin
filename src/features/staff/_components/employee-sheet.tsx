import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type Staff } from '@/types/staff'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getTranslation } from '@/utils/i18n'
import { useRoles } from '@/hooks/queries/use-roles'
import { useShops } from '@/hooks/queries/use-shops'
import { useCreateStaff, useAssignShopAccess } from '@/hooks/queries/use-staff'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// import { MOCK_ROLES } from '../data/mock-staff'

const staffSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  username: z.string().min(1, 'Username is required'),
  phone: z.string().min(1, 'Phone is required'),
  globalRoleId: z.string().optional(),
  pin: z
    .string()
    .min(4, 'PIN must be at least 4 digits')
    .optional()
    .or(z.literal('')),
  access: z.array(
    z.object({
      shopId: z.string(),
      roleId: z.string().min(1, 'Role is required'),
    })
  ),
})

type StaffFormValues = z.infer<typeof staffSchema>

interface EmployeeSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Staff | null
}

export function EmployeeSheet({
  open,
  onOpenChange,
  initialData,
}: EmployeeSheetProps) {
  const { data: shopsData } = useShops()
  const { data: rolesData } = useRoles()

  const shops = Array.isArray(shopsData)
    ? shopsData
    : (shopsData as any)?.data || []
  const roles = Array.isArray(rolesData)
    ? rolesData
    : (rolesData as any)?.data || []

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      fullName: initialData?.fullName || '',
      username: initialData?.username || '',
      phone: initialData?.phone || '',
      globalRoleId: initialData?.globalRoleId || '',
      pin: '',
      access:
        initialData?.access.map((a) => ({
          shopId: a.shopId,
          roleId: a.roleId,
        })) || [],
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          fullName: initialData.fullName || '',
          username: initialData.username || '',
          phone: initialData.phone || '',
          globalRoleId: initialData.globalRoleId || '',
          pin: '',
          access:
            initialData.access.map((a: { shopId: string; roleId: string }) => ({
              shopId: a.shopId,
              roleId: a.roleId,
            })) || [],
        })
      } else {
        form.reset({
          fullName: '',
          username: '',
          phone: '',
          globalRoleId: '',
          pin: '',
          access: [],
        })
      }
    }
  }, [open, initialData, form])

  const handleAccessToggle = (checked: boolean, shopId: string) => {
    const currentAccess = form.getValues('access')
    if (checked) {
      if (
        !currentAccess.some(
          (a: { shopId: string; roleId: string }) => a.shopId === shopId
        )
      ) {
        // Use the first available role (usually Barista or lowest priority) if available
        const rolesArray = roles
        const defaultRoleId = rolesArray[1]?.id || rolesArray[0]?.id || ''
        form.setValue('access', [
          ...currentAccess,
          { shopId, roleId: defaultRoleId },
        ])
      }
    } else {
      form.setValue(
        'access',
        currentAccess.filter(
          (a: { shopId: string; roleId: string }) => a.shopId !== shopId
        )
      )
    }
  }

  const handleRoleChange = (shopId: string, roleId: string) => {
    const currentAccess = form.getValues('access')
    const index = currentAccess.findIndex(
      (a: { shopId: string; roleId: string }) => a.shopId === shopId
    )
    if (index !== -1) {
      const newAccess = [...currentAccess]
      newAccess[index].roleId = roleId
      form.setValue('access', newAccess)
    }
  }

  const createStaff = useCreateStaff()
  const assignShopAccess = useAssignShopAccess()

  const onSubmit = async (data: StaffFormValues) => {
    try {
      if (!initialData) {
        // Create new
        const newStaff = await createStaff.mutateAsync({
          fullName: data.fullName,
          username: data.username,
          phone: data.phone,
          password: 'password123', // Default password
          pin: data.pin || '1234',
          globalRoleId: data.globalRoleId || undefined,
        })

        // Assign access sequentially to avoid race conditions
        for (const access of data.access) {
          await assignShopAccess.mutateAsync({
            staffId: newStaff.id,
            shopId: access.shopId,
            roleId: access.roleId,
          })
        }

        toast.success('Successfully created employee and assigned access')
        onOpenChange(false)
        form.reset()
      } else {
        // Edit flow
        toast.info('Editing staff is not yet fully integrated')
        onOpenChange(false)
      }
    } catch (_error) {
      toast.error('Failed to create staff member')
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex w-full flex-col gap-6 overflow-y-auto p-4 sm:max-w-xl'>
        <SheetHeader>
          <SheetTitle>
            {initialData ? 'Edit Employee' : 'Add New Employee'}
          </SheetTitle>
          <SheetDescription>
            Manage HR details and global access.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          {/* Note: We should ideally reset the form when initialData changes */}
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              // eslint-disable-next-line no-console
              console.error('Staff Form Validation Errors:', errors)
              toast.error('Please check the form for errors')
            })}
            className='flex flex-col gap-6'
          >
            <Tabs defaultValue='profile' className='w-full'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='profile'>Profile</TabsTrigger>
                <TabsTrigger value='access'>Access & Roles</TabsTrigger>
              </TabsList>

              <TabsContent value='profile' className='space-y-4 py-4'>
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder='e.g. John Doe' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='grid grid-cols-2 gap-4'>
                  <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder='johndoe' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='phone'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder='+1...' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name='globalRoleId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Global Role (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select global role' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='admin'>System Admin</SelectItem>
                          <SelectItem value='hr'>HR Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!initialData && (
                  <FormField
                    control={form.control}
                    name='pin'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PIN Code</FormLabel>
                        <FormControl>
                          <Input
                            type='password'
                            placeholder='e.g. 1234'
                            maxLength={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </TabsContent>

              <TabsContent value='access' className='space-y-4 py-4'>
                <div className='space-y-1'>
                  <h3 className='font-medium'>Location Access</h3>
                  <p className='text-sm text-muted-foreground'>
                    Select shops this employee can access.
                  </p>
                </div>
                <div className='flex flex-col space-y-3'>
                  {shops.length === 0 && (
                    <div className='rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground'>
                      No shops found.
                    </div>
                  )}
                  {shops.map((shop: any) => {
                    // Watch access to determine state
                    const currentAccess = form.watch('access') || []
                    const accessEntry = currentAccess.find(
                      (a: { shopId: string; roleId: string }) =>
                        a.shopId === shop.id
                    )
                    const isChecked = !!accessEntry

                    return (
                      <div
                        key={shop.id}
                        className='flex items-center justify-between rounded-lg border p-3'
                      >
                        <div className='flex items-center space-x-3'>
                          <Checkbox
                            id={`shop-${shop.id}`}
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handleAccessToggle(checked as boolean, shop.id)
                            }
                          />
                          <div className='flex flex-col'>
                            <label
                              htmlFor={`shop-${shop.id}`}
                              className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                              {getTranslation(shop.name)}
                            </label>
                            <span className='text-xs text-muted-foreground'>
                              {shop.code}
                            </span>
                          </div>
                        </div>
                        {isChecked && (
                          <Select
                            value={accessEntry.roleId}
                            onValueChange={(val) =>
                              handleRoleChange(shop.id, val)
                            }
                          >
                            <SelectTrigger className='h-8 w-[140px] text-xs'>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role: any) => (
                                <SelectItem key={role.id} value={role.id || ''}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
            </Tabs>

            <div className='mt-auto flex justify-between border-t pt-4'>
              {initialData && (
                <Button type='button' variant='destructive' size='sm'>
                  Deactivate User
                </Button>
              )}
              <Button
                type='submit'
                className={initialData ? '' : 'ml-auto'}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {initialData ? 'Save Changes' : 'Create Staff'}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
