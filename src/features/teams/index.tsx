import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CreateTeamDialog } from './components/create-team-dialog'
import { TeamList } from './components/team-list'
import { TeamDetails } from './components/team-details'
import { Team } from './types'

export function TeamsPage() {
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Teams</h1>
          <p className='text-muted-foreground'>Manage your teams and team members</p>
        </div>
        <Button onClick={() => setIsCreateTeamDialogOpen(true)}>
          <Plus className='mr-2 h-4 w-4' />
          Create Team
        </Button>
      </div>
      
      {selectedTeam ? (
        <TeamDetails team={selectedTeam} onBack={() => setSelectedTeam(null)} />
      ) : (
        <TeamList onSelectTeam={setSelectedTeam} />
      )}
      
      <CreateTeamDialog 
        open={isCreateTeamDialogOpen} 
        onOpenChange={setIsCreateTeamDialogOpen} 
      />
    </div>
  )
}
