import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { roleSchema, type Role } from '../data/role-schema'

interface PermissionInfo {
  id: string
  slug: string
  description?: string
  [key: string]: any
}

interface GroupedPermission {
  id: string
  label: string
  description?: string
  group: string
}

interface RoleSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
  onSave: (role: Role) => void
  permissions: PermissionInfo[]
}

export function RoleSheet({
  open,
  onOpenChange,
  role,
  onSave,
  permissions,
}: RoleSheetProps) {
  const groupedPermissions = permissions.reduce(
    (acc: Record<string, GroupedPermission[]>, permission: PermissionInfo) => {
      // derive group from slug e.g. "pos:access" -> "POS"
      const parts = permission.slug?.split(':') || ['GENERAL', permission.id]
      const groupKey = parts[0].toUpperCase()

      const rawLabel =
        parts.slice(1).join(' ').replace(/_/g, ' ') || permission.slug
      const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1)

      if (!acc[groupKey]) acc[groupKey] = []

      acc[groupKey].push({
        id: permission.id,
        label: label,
        description: permission.description,
        group: groupKey,
      })
      return acc
    },
    {}
  )

  const form = useForm<Role>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      permissions: [],
      usersCount: 0,
    },
  })

  // Reset form when role or open state changes
  useEffect(() => {
    if (open) {
      if (role) {
        form.reset(role)
      } else {
        form.reset({
          name: '',
          slug: '',
          description: '',
          permissions: [],
          usersCount: 0,
        })
      }
    }
  }, [open, role, form])

  // Auto-generate slug from name if creating new role
  const nameValue = form.watch('name')
  useEffect(() => {
    if (!role && nameValue) {
      const slug = nameValue
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '')
      form.setValue('slug', slug || '')
    }
  }, [nameValue, role, form])

  const onSubmit = (data: Role) => {
    // If editing, preserve ID, else generate or let backend handle
    const roleToSave = {
      ...data,
      id: role?.id || crypto.randomUUID(), // simple mock ID generation
      usersCount: role?.usersCount || 0,
    }
    onSave(roleToSave)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='flex h-full w-full flex-col p-0 sm:max-w-2xl'>
        <div className='p-6 pb-2'>
          <SheetHeader>
            <SheetTitle>{role ? 'Edit Role' : 'Create Role'}</SheetTitle>
            <SheetDescription>
              Configure the role details and assign permissions.
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className='flex-1 overflow-hidden px-6'>
          <Form {...form}>
            <form
              id='role-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex h-full flex-col space-y-6'
            >
              <ScrollArea className='-mr-4 h-[calc(100vh-200px)] flex-1 pr-4'>
                <div className='space-y-6 pb-6'>
                  {/* Basic Info */}
                  <div className='space-y-4'>
                    <h3 className='text-sm font-medium text-muted-foreground'>
                      Basic Information
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder='e.g. Store Manager'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name='slug'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder='store_manager' {...field} />
                            </FormControl>
                            <FormDescription>
                              Unique identifier.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name='description'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Describe the responsibilities of this role...'
                              className='resize-none'
                              {...field}
                              value={field.value || ''}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Permissions Matrix */}
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-sm font-medium text-muted-foreground'>
                        Permissions
                      </h3>
                      <span className='text-xs text-muted-foreground'>
                        {form.watch('permissions').length} selected
                      </span>
                    </div>

                    <div className='grid gap-6'>
                      {Object.entries(groupedPermissions).map(
                        ([group, permissions]) => (
                          <div key={group} className='space-y-3'>
                            <h4 className='text-sm font-semibold'>{group}</h4>
                            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                              {permissions.map(
                                (permission: GroupedPermission) => (
                                  <FormField
                                    key={permission.id}
                                    control={form.control}
                                    name='permissions'
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={permission.id}
                                          className='flex flex-row items-start space-y-0 space-x-3 rounded-md border p-3 shadow-sm transition-colors hover:bg-muted/50'
                                        >
                                          <FormControl>
                                            <Checkbox
                                              className='mt-0.5'
                                              checked={field.value?.includes(
                                                permission.id
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      permission.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !==
                                                          permission.id
                                                      )
                                                    )
                                              }}
                                            />
                                          </FormControl>
                                          <div className='space-y-1 leading-none'>
                                            <FormLabel className='cursor-pointer text-sm font-normal'>
                                              {permission.label}
                                            </FormLabel>
                                            {permission.description && (
                                              <p className='text-[0.8rem] text-muted-foreground'>
                                                {permission.description}
                                              </p>
                                            )}
                                          </div>
                                        </FormItem>
                                      )
                                    }}
                                  />
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className='mt-auto border-t pt-4'></div>
            </form>
          </Form>
        </div>

        <SheetFooter className='flex flex-row justify-end px-6 pb-6'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type='submit' form='role-form'>
            Save Changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
