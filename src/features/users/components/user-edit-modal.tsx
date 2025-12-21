import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { userAPI } from '@/api/user.api'
import { roleAPI } from '@/api/role.api'
import type { IUserResponse } from '@/contracts/Response/IUser'
import type { UpdateUserRequest, Role } from '@/contracts/Request'

interface UserEditModalProps {
  user: IUserResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: () => void
}

export function UserEditModal({ user, open, onOpenChange, onUserUpdated }: UserEditModalProps) {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    designation: '',
    address: '',
    roleIds: [],
    managerId: null,
    teamId: null,
    isActive: true,
  })
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await roleAPI.getRoles()
        setRoles(rolesData)
      } catch (error) {
        console.error('Failed to fetch roles:', error)
      }
    }
    fetchRoles()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || '',
        designation: user.designation || '',
        address: user.address || '',
        roleIds: [],
        managerId: user.managerId,
        teamId: user.teamId,
        isActive: user.isActive,
      })
      // Set the first role as selected (assuming single role)
      const userRole = roles.find(role => user.roles.includes(role.name))
      if (userRole) {
        setSelectedRole(userRole.id.toString())
        setFormData(prev => ({ ...prev, roleIds: [userRole.id] }))
      }
    }
  }, [user, roles])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    try {
      await userAPI.updateUser(user.id.toString(), formData)
      onUserUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={(value) => {
                setSelectedRole(value)
                const roleId = parseInt(value)
                setFormData({ ...formData, roleIds: [roleId] })
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}