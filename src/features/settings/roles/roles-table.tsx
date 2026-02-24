import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from '@/hooks/queries/use-roles'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/custom/data-table'
import { type Role } from '../data/role-schema'
import { RoleSheet } from './role-sheet'
import { columns } from './roles-columns'

interface RolesTableProps {
  data: Role[]
  permissions: any[]
}

export function RolesTable({ data, permissions }: RolesTableProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const { mutate: createRole } = useCreateRole()
  const { mutate: updateRole } = useUpdateRole()
  const { mutate: deleteRole } = useDeleteRole()

  const handleCreate = () => {
    setEditingRole(null)
    setIsSheetOpen(true)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setIsSheetOpen(true)
  }

  const handleDelete = (role: Role) => {
    if (confirm(`Are you sure you want to delete ${role.name}?`)) {
      deleteRole(role.id as string)
    }
  }

  const handleSave = (role: Role) => {
    if (editingRole) {
      updateRole({
        id: editingRole.id as string,
        data: {
          name: role.name,
          description: role.description,
          permissionIds: role.permissions,
        },
      })
    } else {
      createRole({
        name: role.name,
        slug: role.slug,
        description: role.description,
        permissionIds: role.permissions,
      })
    }
    setIsSheetOpen(false)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Roles & Permissions
          </h2>
          <p className='text-muted-foreground'>
            Manage access levels and permissions for your team.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button onClick={handleCreate}>
            <Plus className='mr-2 h-4 w-4' />
            Create Role
          </Button>
        </div>
      </div>
      <DataTable
        data={data}
        columns={columns}
        searchKey='name'
        meta={{
          onEdit: handleEdit,
          onDelete: handleDelete,
        }}
      />

      <RoleSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        role={editingRole}
        onSave={handleSave}
        permissions={permissions}
      />
    </div>
  )
}
