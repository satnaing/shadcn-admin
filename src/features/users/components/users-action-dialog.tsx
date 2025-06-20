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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  console.log('currentRow:', currentRow);

  const isEdit = !!currentRow;

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', // This ensures validation runs on change
    defaultValues: isEdit
      ? {
          ...currentRow,
          is_super_admin: currentRow.role === 'superadmin' ? 'yes' : 'no',
          isEdit,
        }
      : {
          fname: '',
          lname: '',
          email: '',
          phone_number: '',
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
  }
  const [services, setServices] = React.useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = React.useState(true);
  
  React.useEffect(() => {
    setLoadingServices(true);
    const getToken = () => {
      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : '';
    };
    const token = getToken();
    
    console.log(document.cookie);
    console.log('Token:', token);
    
    axios.get(`${BACKEND_URL}/v1/superadmin/allService`, {
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
  const allRoles = [
    { id: 6, name: 'Superadmin', value: 'superadmin' },
    { id: 2, name: 'Manager', value: 'manager' },
    { id: 3, name: 'Viewer', value: 'viewer' },
    { id: 1, name: 'Regular User', value: 'regularuser' },
  ];
  
  const allPermissions = [
    { id: 1, value: 'read', label: 'Can view user information' },
    { id: 2, value: 'update', label: 'Can update user information' },
    { id: 3, value: 'delete', label: 'Can delete user information' },
    { id: 6, value: 'create', label: 'Can create resources' },
  ];

  // Watch form values
  const watchedValues = form.watch();
  const isSuperAdmin = watchedValues.is_super_admin === 'yes';

  // Effect to clear services/roles/permissions when switching to superadmin
  React.useEffect(() => {
    if (isSuperAdmin) {
      form.setValue('services', []);
      form.setValue('roles', []);
      form.setValue('permissions', []);
    }
  }, [isSuperAdmin, form]);

  const onSubmit = async (values: UserForm) => {
    try {
      debugger;
      let payload;
      if (values.is_super_admin === 'yes') {
        payload = {
          id:currentRow?.id,
          email: values.email,
          fname: values.fname,
          lname: values.lname,
          phone_number: values.phone_number || '',
          is_super_admin: true,
          assignments: [],
        };
      } else {
        const assignments = values.services.map(serviceId => {
          const roleKey = values.roles.find(r => r.startsWith(`${serviceId}:`));
          if (!roleKey) return null;
          const roleValue = roleKey.split(':')[1];
          const roleObj = allRoles.find(r => r.value === roleValue);
          const role_id = roleObj ? roleObj.id : null;
          if (!role_id) return null;

          let permission_ids: number[] = [];
          if (roleValue === 'regularuser') {
            permission_ids = values.permissions
              .filter(p => p.startsWith(`${serviceId}:${roleValue}:`))
              .map(p => {
                const permValue = p.split(':')[2];
                const permObj = allPermissions.find(ap => ap.value === permValue);
                return permObj ? permObj.id : null;
              })
              .filter((id): id is number => id !== null);
          } else if (roleValue === 'manager') {
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
          id:currentRow?.id,
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

      const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
      const token = match ? decodeURIComponent(match[1]) : '';
      
      await axios.put(
        `${BACKEND_URL}/v1/superadmin/user`,
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
                          {isSuperAdmin ? (
                            <div className='text-muted-foreground pointer-events-none opacity-60'>
                              All services/roles/permissions are granted to superadmin.
                            </div>
                          ) : (
                            services.map(service => {
                              const serviceId = String(service.id);
                              const isServiceSelected = field.value?.includes(serviceId);
                              
                              return (
                                <div key={serviceId} className='border rounded p-2'>
                                  <label className='font-semibold flex items-center gap-2'>
                                    <input
                                      type='checkbox'
                                      checked={isServiceSelected}
                                      onChange={e => {
                                        const checked = e.target.checked;
                                        let newServices = [...(field.value || [])];
                                        
                                        if (checked) {
                                          if (!newServices.includes(serviceId)) {
                                            newServices.push(serviceId);
                                          }
                                        } else {
                                          newServices = newServices.filter(v => v !== serviceId);
                                          // Remove roles/permissions for this service
                                          const newRoles = selectedRoles.filter(r => !r.startsWith(`${serviceId}:`));
                                          const newPermissions = selectedPermissions.filter(p => !p.startsWith(`${serviceId}:`));
                                          form.setValue('roles', newRoles);
                                          form.setValue('permissions', newPermissions);
                                        }
                                        
                                        field.onChange(newServices);
                                      }}
                                    />
                                    {service.name}
                                  </label>
                                  
                                  {/* Roles for this service */}
                                  {isServiceSelected && (
                                    <div className='ml-6 mt-2'>
                                      <div className='font-medium mb-1'>Roles:</div>
                                      {allRoles.map(role => {
                                        const roleKey = `${serviceId}:${role.value}`;
                                        const isRoleSelected = selectedRoles.includes(roleKey);
                                        
                                        return (
                                          <div key={role.value} className='ml-2'>
                                            <label className='flex items-center gap-2'>
                                              <input
                                                type='checkbox'
                                                checked={isRoleSelected}
                                                onChange={e => {
                                                  const checked = e.target.checked;
                                                  let newRoles = [...selectedRoles];
                                                  
                                                  if (checked) {
                                                    if (!newRoles.includes(roleKey)) {
                                                      newRoles.push(roleKey);
                                                    }
                                                  } else {
                                                    newRoles = newRoles.filter(r => r !== roleKey);
                                                    // Remove permissions for this role
                                                    const newPermissions = selectedPermissions.filter(p => !p.startsWith(`${serviceId}:${role.value}:`));
                                                    form.setValue('permissions', newPermissions);
                                                  }
                                                  
                                                  form.setValue('roles', newRoles);
                                                }}
                                              />
                                              {role.name}
                                            </label>
                                            
                                            {/* Permissions for regularuser role */}
                                            {isRoleSelected && role.value === 'regularuser' && (
                                              <div className='ml-6 mt-1 flex flex-wrap gap-2'>
                                                {allPermissions.map(perm => {
                                                  const permKey = `${serviceId}:${role.value}:${perm.value}`;
                                                  const isPermSelected = selectedPermissions.includes(permKey);
                                                  
                                                  return (
                                                    <label key={perm.id} className='flex items-center gap-1'>
                                                      <input
                                                        type='checkbox'
                                                        checked={isPermSelected}
                                                        onChange={e => {
                                                          const checked = e.target.checked;
                                                          let newPerms = [...selectedPermissions];
                                                          
                                                          if (checked) {
                                                            if (!newPerms.includes(permKey)) {
                                                              newPerms.push(permKey);
                                                            }
                                                          } else {
                                                            newPerms = newPerms.filter(p => p !== permKey);
                                                          }
                                                          
                                                          form.setValue('permissions', newPerms);
                                                        }}
                                                      />
                                                      <span className='text-sm'>{perm.value}</span>
                                                    </label>
                                                  );
                                                })}
                                              </div>
                                            )}
                                          </div>
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button 
            type='submit' 
            form='user-form'
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}