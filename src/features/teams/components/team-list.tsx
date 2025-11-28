import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Archive, Users } from 'lucide-react'
import { useState } from 'react'
import { EditTeamDialog } from './edit-team-dialog'
import { TeamDetails } from './team-details'
import { Team } from '../types'

// Mock data for teams
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Development Team',
    description: 'Core development team for the product',
    coverImage: '',
    visibility: 'private',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    isArchived: false,
    members: 5,
  },
  {
    id: '2',
    name: 'Design Team',
    description: 'UI/UX design and branding',
    coverImage: '',
    visibility: 'private',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    isArchived: false,
    members: 3,
  },
  {
    id: '3',
    name: 'Marketing Team',
    description: 'Marketing and sales initiatives',
    coverImage: '',
    visibility: 'public',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    isArchived: true,
    members: 4,
  },
]

interface TeamListProps {
  onSelectTeam: (team: Team) => void
}

export function TeamList({ onSelectTeam }: TeamListProps) {
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)

  const handleArchiveTeam = (teamId: string) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, isArchived: !team.isArchived } : team
    ))
  }

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {teams.map((team) => (
            <Card key={team.id} className={`transition-all duration-300 hover:shadow-lg ${team.isArchived ? 'opacity-50' : ''}`}>
              <CardHeader>
                <CardTitle className='flex items-center justify-between'>
                  <span>{team.name}</span>
                  {team.isArchived && <span className='text-xs text-muted-foreground'>Archived</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground text-sm mb-4'>{team.description}</p>
                <div className='flex items-center text-sm text-muted-foreground mb-2'>
                  <Users className='mr-1 h-4 w-4' />
                  <span>{team.members} members</span>
                </div>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <span className={`px-2 py-1 rounded-full text-xs ${team.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {team.visibility.charAt(0).toUpperCase() + team.visibility.slice(1)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className='flex gap-2'>
                <Button 
                  variant='outline' 
                  size='sm' 
                  className='flex-1' 
                  onClick={() => onSelectTeam(team)}
                >
                  <Users className='mr-1 h-4 w-4' />
                  View Members
                </Button>
                <Button 
                  variant='outline' 
                  size='sm' 
                  className='flex-1' 
                  onClick={() => setEditingTeam(team)}
                >
                  <Edit className='mr-1 h-4 w-4' />
                  Edit
                </Button>
                <Button 
                  variant='outline' 
                  size='sm' 
                  className='flex-1' 
                  onClick={() => handleArchiveTeam(team.id)}
                >
                  <Archive className='mr-1 h-4 w-4' />
                  {team.isArchived ? 'Unarchive' : 'Archive'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      
      {editingTeam && (
        <EditTeamDialog 
          team={editingTeam} 
          open={true} 
          onOpenChange={(open) => !open && setEditingTeam(null)} 
          onUpdate={(updatedTeam) => {
            setTeams(teams.map(team => 
              team.id === updatedTeam.id ? updatedTeam : team
            ))
            setEditingTeam(null)
          }}
        /> 
      )}
    </div>
  )
}
