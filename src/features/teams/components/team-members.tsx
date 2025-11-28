import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, UserPlus, MoreVertical } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TeamMember, TeamRole, MemberStatus } from '../types'

// Mock data for team members
const mockMembers: TeamMember[] = [
  {
    id: '1',
    userId: 'user-1',
    teamId: 'team-1',
    role: 'admin',
    status: 'online',
    joinedAt: new Date('2024-01-01'),
    lastActiveAt: new Date(),
  },
  {
    id: '2',
    userId: 'user-2',
    teamId: 'team-1',
    role: 'editor',
    status: 'away',
    joinedAt: new Date('2024-01-02'),
    lastActiveAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    userId: 'user-3',
    teamId: 'team-1',
    role: 'viewer',
    status: 'busy',
    joinedAt: new Date('2024-01-03'),
    lastActiveAt: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: '4',
    userId: 'user-4',
    teamId: 'team-1',
    role: 'visitor',
    status: 'offline',
    joinedAt: new Date('2024-01-04'),
    lastActiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

const getStatusBadge = (status: MemberStatus) => {
  const statusMap = {
    online: { color: 'bg-green-500', text: 'Online' },
    away: { color: 'bg-yellow-500', text: 'Away' },
    busy: { color: 'bg-red-500', text: 'Busy' },
    offline: { color: 'bg-gray-500', text: 'Offline' },
  }
  const { color, text } = statusMap[status]
  return <Badge className={`${color} text-white`}>{text}</Badge>
}

const getRoleBadge = (role: TeamRole) => {
  const roleMap = {
    admin: { color: 'bg-purple-500', text: 'Admin' },
    editor: { color: 'bg-blue-500', text: 'Editor' },
    viewer: { color: 'bg-green-500', text: 'Viewer' },
    visitor: { color: 'bg-gray-500', text: 'Visitor' },
  }
  const { color, text } = roleMap[role]
  return <Badge className={`${color} text-white`}>{text}</Badge>
}

export function TeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamRole>('viewer')

  const handleInviteMember = () => {
    if (!inviteEmail) return
    
    // TODO: Implement member invitation API call
    console.log('Inviting member:', inviteEmail, 'with role:', inviteRole)
    
    // Simulate API call
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      userId: `user-${Date.now()}`,
      teamId: 'team-1',
      role: inviteRole,
      status: 'offline',
      joinedAt: new Date(),
      lastActiveAt: new Date(),
    }
    
    setMembers([...members, newMember])
    setInviteEmail('')
    setInviteRole('viewer')
  }

  const handleUpdateRole = (memberId: string, newRole: TeamRole) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ))
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId))
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Team Members</CardTitle>
        <Button>
          <UserPlus className='mr-2 h-4 w-4' />
          Invite Members
        </Button>
      </CardHeader>
      <CardContent>
        <div className='bg-muted/50 p-4 rounded-lg mb-6'>
          <h3 className='text-sm font-medium mb-3'>Invite New Member</h3>
          <div className='flex gap-2'>
            <Input 
              placeholder='Enter email address' 
              value={inviteEmail} 
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleInviteMember()}
              className='flex-1'
            />
            <Select 
              value={inviteRole} 
              onValueChange={(value) => setInviteRole(value as TeamRole)}
            >
              <SelectTrigger className='w-[150px]'>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='admin'>Admin</SelectItem>
                <SelectItem value='editor'>Editor</SelectItem>
                <SelectItem value='viewer'>Viewer</SelectItem>
                <SelectItem value='visitor'>Visitor</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleInviteMember}>
              <Plus className='mr-2 h-4 w-4' />
              Invite
            </Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>User {member.userId.split('-')[1]}</TableCell>
                <TableCell>user{member.userId.split('-')[1]}@example.com</TableCell>
                <TableCell>{getRoleBadge(member.role)}</TableCell>
                <TableCell>{getStatusBadge(member.status)}</TableCell>
                <TableCell>{member.joinedAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' size='sm'>
                        <MoreVertical className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'admin')}>
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'editor')}>
                        Make Editor
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'viewer')}>
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'visitor')}>
                        Make Visitor
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className='text-red-600' 
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
