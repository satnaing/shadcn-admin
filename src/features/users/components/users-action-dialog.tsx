

import React from 'react'
import axios from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { User } from '../data/schema'


const formSchema = z.object({
  fname: z.string().min(1, { message: 'First Name is required.' }),
  lname: z.string().min(1, { message: 'Last Name is required.' }),
  email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Email is invalid.' }),
  phone_number: z.string().optional(),
  is_super_admin: z.enum(['yes', 'no'], { required_error: 'Please select if user is superadmin.' }),
  services: z.array(z.string()),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  isEdit: z.boolean(),
}).superRefine((data, ctx) => {
  if (data.is_super_admin === 'no') {
    if (!data.services || data.services.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['services'],
        message: 'Select at least one service.'
      });
    }
    if (!data.roles || data.roles.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['roles'],
        message: 'Select at least one role.'
      });
    }
    if (!data.permissions || data.permissions.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['permissions'],
        message: 'Select at least one permission.'
      });
    }
  }
});
type UserForm = z.infer<typeof formSchema>;

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {


  console.log('currentRow:', currentRow);

  const isEdit = !!currentRow;

  
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
          is_super_admin: currentRow.role === 'superadmin' ? 'yes' :'no' ,
          isEdit,
        }
      : {
          fname: '',
          lname: '',
          email: '',
          is_super_admin: 'no',
          services: [],
          roles: [],
          permissions: [],
          isEdit,
        },
  });

  // --- Fetch services from API ---
  interface Service {
    id: string | number;
    name: string;
    // Add other properties if needed
  }
  const [services, setServices] = React.useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = React.useState(true);
  React.useEffect(() => {
    setLoadingServices(true);
    // Get token from cookies
    const getToken = () => {
      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : '';
    };
    const token = getToken();
    // Allow console for debugging
    // eslint-disable-next-line no-console
    console.log(document.cookie);
    console.log('Token:', token);
    axios.get('http://localhost:3003/v1/superadmin/allService', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then(res => {
        setServices(res.data);
        setLoadingServices(false);
      })
      .catch(() => setLoadingServices(false));
  }, []);

  // --- Static roles/permissions for demo ---
  // These should be fetched from API in real app
  // For now, hardcode with ids for mapping (from your DB)
  const allRoles = [
    { id: 6, name: 'Superadmin', value: 'superadmin' },
    { id: 2, name: 'Manager', value: 'manager' },
    { id: 3, name: 'Viewer', value: 'viewer' },
    { id: 1, name: 'Regular User', value: 'regularuser' },
  ];
  // Permissions with ids
  const allPermissions = [
    { id: 1, value: 'read', label: 'Can view user information' },
    { id: 2, value: 'update', label: 'Can update user information' },
    { id: 3, value: 'delete', label: 'Can delete user information' },
    { id: 6, value: 'create', label: 'Can create resources' },
  ];

  const onSubmit = async (values: UserForm) => {
    try {
      let payload;
      if (values.is_super_admin === 'yes') {
        // Only send basic user details for superadmin
        payload = {
          email: values.email,
          fname: values.fname,
          lname: values.lname,
          phone_number: values.phone_number || '',
          is_super_admin: true,
          assignments: [],
        };
      } else {
        // Build assignments array as per required payload
        const assignments = values.services.map(serviceId => {
          // Find selected role for this service (should only be one per service)
          const roleKey = values.roles.find(r => r.startsWith(`${serviceId}:`));
          if (!roleKey) return null;
          const roleValue = roleKey.split(':')[1];
          const roleObj = allRoles.find(r => r.value === roleValue);
          const role_id = roleObj ? roleObj.id : null;
          if (!role_id) return null;

          // For permissions, only for regularuser role
          let permission_ids: number[] = [];
          if (roleValue === 'regularuser') {
            // Collect permission ids for this service/role
            permission_ids = values.permissions
              .filter(p => p.startsWith(`${serviceId}:${roleValue}:`))
              .map(p => {
                const permValue = p.split(':')[2];
                const permObj = allPermissions.find(ap => ap.value === permValue);
                return permObj ? permObj.id : null;
              })
              .filter((id): id is number => id !== null);
          } else if (roleValue === 'manager') {
            // For manager, assign CRU permissions (read, update, create)
            permission_ids = allPermissions
              .filter(ap => ['read', 'update', 'create'].includes(ap.value))
              .map(ap => ap.id);
          }

          return {
            service_id: Number(serviceId),
            role_id,
            permission_ids,
          };
        }).filter(Boolean);


       

        payload = {
          email: values.email,
          fname: values.fname,
          lname: values.lname,
          phone_number: values.phone_number || '',
          is_super_admin: false,
          assignments,
        };
      }

      console.log('Submitting user data:', payload);
      console.log('Form values:', JSON.stringify(payload));

      // Get token from cookies
      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      const token = match ? decodeURIComponent(match[1]) : '';
      await axios.post(
        'http://localhost:3003/v1/superadmin/user',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert('User added successfully!');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Failed to add user. Please try again.');
      } else {
        alert('Failed to add user. Please try again.');
      }
    }
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
          <DialogTitle>{isEdit ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the user here. ' : 'Create new user here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                name='fname'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John'
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
                name='lname'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Doe'
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
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@gmail.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone_number'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='e.g. +1234567890'
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
                name='is_super_admin'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>Is Superadmin?</FormLabel>
                    <FormControl>
                      <div className='col-span-4 flex gap-4'>
                        <label>
                          <input
                            type='radio'
                            value='yes'
                            checked={field.value === 'yes'}
                            onChange={() => field.onChange('yes')}
                          />{' '}
                          Yes
                        </label>
                        <label>
                          <input
                            type='radio'
                            value='no'
                            checked={field.value === 'no'}
                            onChange={() => field.onChange('no')}
                          />{' '}
                          No
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='services'
                render={({ field }) => {
                  const issuperadmin = form.watch('is_super_admin');
                  const selectedRoles = form.watch('roles') || [];
                  const selectedPermissions = form.watch('permissions') || [];

                  if (loadingServices) {
                    return (
                      <FormItem className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-right pt-2'>Services</FormLabel>
                        <FormControl>
                          <div className='col-span-4'>Loading services...</div>
                        </FormControl>
                      </FormItem>
                    );
                  }

                  return (
                    <FormItem className='grid grid-cols-6 items-start gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-right pt-2'>Services</FormLabel>
                      <FormControl>
                        <div className='col-span-4 flex flex-col gap-4'>
                          {issuperadmin === 'yes' ? (
                            <div className='text-muted-foreground pointer-events-none opacity-60'>All services/roles/permissions are granted to superadmin.</div>
                          ) : (
                            services.map(service => {
                              const serviceId = String(service.id);
                              return (
                                <div key={serviceId} className='border rounded p-2'>
                                  <label className='font-semibold flex items-center gap-2'>
                                    <input
                                      type='checkbox'
                                      checked={field.value?.includes(serviceId)}
                                      onChange={e => {
                                        const checked = e.target.checked;
                                        if (checked) {
                                          field.onChange([...field.value, serviceId]);
                                        } else {
                                          field.onChange(field.value.filter(v => v !== serviceId));
                                          // Remove roles/permissions for this service
                                          form.setValue('roles', selectedRoles.filter(r => !r.startsWith(`${serviceId}:`)));
                                          form.setValue('permissions', selectedPermissions.filter(p => !p.startsWith(`${serviceId}:`)));
                                        }
                                      }}
                                    />
                                    {service.name}
                                  </label>
                                  {/* Roles for this service */}
                                  {field.value?.includes(serviceId) && (
                                    <div className='ml-6 mt-2'>
                                      <div className='font-medium mb-1'>Roles:</div>
                                      {allRoles.map(role => {
                                        const roleKey = `${serviceId}:${role.value}`;
                                        const checked = selectedRoles.includes(roleKey);
                                        return (
                                          <label key={role.value} className='flex items-center gap-2 ml-2'>
                                            <input
                                              type='checkbox'
                                              checked={checked}
                                              onChange={e => {
                                                const checked = e.target.checked;
                                                let newRoles = [...selectedRoles];
                                                if (checked) {
                                                  // Allow multiple roles per service
                                                  if (!newRoles.includes(roleKey)) {
                                                    newRoles.push(roleKey);
                                                  }
                                                } else {
                                                  newRoles = newRoles.filter(r => r !== roleKey);
                                                  // Remove permissions for this role
                                                  form.setValue('permissions', selectedPermissions.filter(p => !p.startsWith(`${serviceId}:${role.value}:`)));
                                                }
                                                form.setValue('roles', newRoles);
                                              }}
                                            />
                                            {role.name}
                                            {/* Permissions for this role */}
                                            {checked && role.value === 'regularuser' && (
                                              <span className='ml-4'>
                                                {allPermissions.map(perm => {
                                                  const permKey = `${serviceId}:${role.value}:${perm.value}`;
                                                  return (
                                                    <label key={perm.id} className='mr-2'>
                                                      <input
                                                        type='checkbox'
                                                        checked={selectedPermissions.includes(permKey)}
                                                        onChange={e => {
                                                          const checked = e.target.checked;
                                                          let newPerms = [...selectedPermissions];
                                                          if (checked) {
                                                            newPerms.push(permKey);
                                                          } else {
                                                            newPerms = newPerms.filter(p => p !== permKey);
                                                          }
                                                          form.setValue('permissions', newPerms);
                                                        }}
                                                      />
                                                      {perm.value}
                                                    </label>
                                                  );
                                                })}
                                              </span>
                                            )}
                                          </label>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  );
                }}
              />
              <DialogFooter>
                <Button type='submit' disabled={false}>
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
