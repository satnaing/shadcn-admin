import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Users, ArrowLeft } from 'lucide-react'
import { Team } from '../types'
import { EditTeamDialog } from './edit-team-dialog'
import { TeamMembers } from './team-members'
import { Link } from '@tanstack/react-router'

interface TeamDetailsProps {
  team: Team
  onBack: () => void
}

export function TeamDetails({ team, onBack }: TeamDetailsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleUpdateTeam = (updatedTeam: Team) => {
    // TODO: Implement team update logic
    console.log('Updated team:', updatedTeam)
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4'>
        <Button variant='outline' size='icon' onClick={onBack}>
          <ArrowLeft className='h-4 w-4' />
        </Button>
        <div>
          <h1 className='text-3xl font-bold'>{team.name}</h1>
          <p className='text-muted-foreground'>{team.description}</p>
        </div>
        <Button 
          variant='outline' 
          size='sm' 
          className='ml-auto' 
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className='mr-1 h-4 w-4' />
          Edit Team
        </Button>
      </div>
      
      <div className='grid gap-6 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Team Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div>
                <div className='text-sm text-muted-foreground'>Visibility</div>
                <div className='font-medium'>{team.visibility.charAt(0).toUpperCase() + team.visibility.slice(1)}</div>
              </div>
              <div>
                <div className='text-sm text-muted-foreground'>Created At</div>
                <div className='font-medium'>{team.createdAt.toLocaleDateString()}</div>
              </div>
              <div>
                <div className='text-sm text-muted-foreground'>Updated At</div>
                <div className='font-medium'>{team.updatedAt.toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
            <CardDescription>{team.members} members in this team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <Users className='h-5 w-5 text-muted-foreground' />
              <span className='font-medium'>{team.members} members</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <TeamMembers />
      
      <EditTeamDialog 
        team={team} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
        onUpdate={handleUpdateTeam} 
      />
    </div>
  )
}
