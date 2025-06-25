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
import { useQueryClient } from '@tanstack/react-query'

interface BackendPermission {
  name: string;
}

interface BackendRole {
  role_name: string;
  permissions: BackendPermission[];
}

interface BackendService {
  service_id: string | number;
  roles: BackendRole[];
}

type DialogUser = User & {
  services?: BackendService[];
  fname?: string;
  lname?: string;
  phone_number?: string;
};

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const formSchema = z.object({
  fname: z.string().min(1, { message: 'First Name is required.' }),
  lname: z.string().min(1, { message: 'Last Name is required.' }),
  email: z.string().min(1, { message: 'Email is required.' }).email({ message: 'Email is invalid.' }),
  phone_number: z.string().min(10, { message: 'Phone Number is required.' }),
  services: z.array(z.string()),
  roles: z.array(z.string()),
  permissions: z.array(z.string()),
  isEdit: z.boolean(),
}).superRefine((data, ctx) => {
  {
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
  }
});



type UserForm = z.infer<typeof formSchema>;

interface Props {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}






function mapUserToFormDefaults(user: User) {
  const detailedUser = user as DialogUser;
  // Map services, roles, and permissions from backend structure
  const services: string[] = [];
  const roles: string[] = [];
  const permissions: string[] = [];

  if (Array.isArray(detailedUser.services)) {
    for (const svc of detailedUser.services) {
      const serviceId = String(svc.service_id);
      services.push(serviceId);

      if (Array.isArray(svc.roles)) {
        for (const role of svc.roles) {
          const roleKey = `${serviceId}:${role.role_name}`;
          roles.push(roleKey);

          if (Array.isArray(role.permissions)) {
            for (const perm of role.permissions) {
              const permKey = `${serviceId}:${role.role_name}:${perm.name}`;
              permissions.push(permKey);
            }
          }
        }
      }
    }
  }

  return {
    fname: detailedUser.fname || detailedUser.firstName || '',
    lname: detailedUser.lname || detailedUser.lastName || '',
    email: user.email || '',
    phone_number: detailedUser.phone_number || detailedUser.phoneNumber || '',
    services,
    roles,
    permissions,
    isEdit: true,
  };
}


export function UsersActionDialog({ currentRow, open, onOpenChange }: Props) {
  console.log('UsersActionDialog rendered');
  console.log('currentRow:', currentRow);
  const queryClient = useQueryClient();
  const isEdit = !!currentRow;

  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    criteriaMode: 'all',
    defaultValues: isEdit && currentRow
      ? mapUserToFormDefaults(currentRow)
      : {
          fname: '',
          lname: '',
          email: '',
          phone_number: '',
          services: [],
          roles: [],
          permissions: [],
          isEdit: false,
        },
  });

  React.useEffect(() => {
    if (open) {
      if (isEdit && currentRow) {
        form.reset(mapUserToFormDefaults(currentRow));
      } else {
        form.reset({
          fname: '',
          lname: '',
          email: '',
          phone_number: '',
          services: [],
          roles: [],
          permissions: [],
          isEdit: false,
        });
      }
    }
  }, [open, isEdit, currentRow]);

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
      const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      return match ? decodeURIComponent(match[1]) : '';
    };
    const token = getToken();
    
    console.log(document.cookie);
    console.log('Token:', token);
    

    
     axios.get(`${BACKEND_BASE_URL}/v1/superadmin/allService`, {
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

console.log('isEdit:', isEdit);
// console.log('currentRow:', currentRow);
  console.log('getValue:', form.formState.defaultValues);
  console.log('form values:', form.getValues());

  // --- Static roles/permissions for demo ---
  const allRoles = [
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

 

  const onSubmit = async (values: UserForm) => {
    try {
      let payload;
      // Always build assignments for both add and edit
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

      if (isEdit) {
        // Edit user payload with assignments and optional fields
        const payload: {
          id: string;
          assignments: ({ service_id: number; role_id: number; permission_ids: number[] } | null)[];
          fname?: string;
          lname?: string;
          phone_number?: string;
        } = {
          id: currentRow?.id,
          assignments,
        };
        if (currentRow?.firstName) payload.fname = currentRow.firstName;
        if (currentRow?.lastName) payload.lname = currentRow.lastName;
        if (currentRow?.phoneNumber) payload.phone_number = currentRow.phoneNumber;
        const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
        const token = match ? decodeURIComponent(match[1]) : '';
        console.log('Edit payload:', payload);
        await axios.put(
          `${BACKEND_BASE_URL}/v1/superadmin/updateUser`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        alert('User updated successfully!');
      } else {
        // Add user payload (with assignments)
        payload = {
          email: values.email,
          fname: values.fname,
          lname: values.lname,
          phone_number: values.phone_number || '',
          assignments,
        };
        const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
        const token = match ? decodeURIComponent(match[1]) : '';
        await axios.post(
          `${BACKEND_BASE_URL}/v1/superadmin/addUser`,
          payload,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        alert('User added successfully!');
      }
  
      queryClient.invalidateQueries({ queryKey: ['users'] });
       form.reset();
      onOpenChange(false);
    } catch (err) {
      console.error('User action error:', err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Failed to save user. Please try again.');
      } else {
        alert('Failed to save user. Please try again.');
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
                        readOnly={isEdit}
                        tabIndex={isEdit ? -1 : 0}
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
                        readOnly={isEdit}
                        tabIndex={isEdit ? -1 : 0}
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
                        readOnly={isEdit}
                        tabIndex={isEdit ? -1 : 0}
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
                        readOnly={isEdit}
                        tabIndex={isEdit ? -1 : 0}
                      />
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
                          {services.map(service => {
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
                          })}
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
            // disabled={form.formState.isSubmitting}
                  

          >
            {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
