import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { MoreHorizontal, PlayCircle, Settings, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useAgents } from './agents-provider'
import { format } from 'date-fns'
import { AgentCreateDialog } from './agent-create-dialog'
import { useState } from 'react'

interface AgentListProps {
  activeOnly?: boolean
}

export function AgentList({ activeOnly = false }: AgentListProps) {
  const { agents, loading, fetchAgents } = useAgents()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)

  const filteredAgents = activeOnly ? agents.filter(agent => agent.isActive) : agents

  if (loading) {
    return <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className='animate-pulse'>
          <CardHeader className='h-24'>
            <div className='flex items-center space-x-4'>
              <div className='w-12 h-12 rounded-full bg-gray-200'></div>
              <div className='space-y-2'>
                <div className='h-4 w-32 bg-gray-200 rounded'></div>
                <div className='h-3 w-24 bg-gray-200 rounded'></div>
              </div>
            </div>
          </CardHeader>
          <CardContent className='h-32 space-y-2'>
            <div className='h-4 w-full bg-gray-200 rounded'></div>
            <div className='h-4 w-full bg-gray-200 rounded'></div>
            <div className='h-4 w-3/4 bg-gray-200 rounded'></div>
          </CardContent>
          <CardFooter className='h-16'>
            <div className='flex justify-between w-full'>
              <div className='space-x-2'>
                <div className='h-8 w-20 bg-gray-200 rounded'></div>
                <div className='h-8 w-20 bg-gray-200 rounded'></div>
              </div>
              <div className='h-8 w-8 bg-gray-200 rounded-full'></div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  }

  if (filteredAgents.length === 0) {
    return <div className='flex flex-col items-center justify-center py-16 text-center'>
      <Avatar className='mb-4 h-16 w-16'>
        <span className='text-2xl'>🤖</span>
      </Avatar>
      <h3 className='text-lg font-medium'>No agents found</h3>
      <p className='text-muted-foreground mb-4 max-w-md'>
        You don't have any agents created yet. Create your first agent to get started.
      </p>
      <Button onClick={() => {
        setSelectedAgentId(null)
        setIsEditDialogOpen(true)
      }}>
        Create Agent
      </Button>
    </div>
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredAgents.map(agent => (
          <Card key={agent.id} className='flex flex-col h-full'>
            <CardHeader className='flex flex-row items-start justify-between'>
              <div className='flex items-center space-x-4'>
                <Avatar className='h-12 w-12'>
                  <span className='text-xl'>🤖</span>
                </Avatar>
                <div>
                  <CardTitle className='text-lg line-clamp-1'>{agent.name}</CardTitle>
                  <CardDescription className='text-xs text-muted-foreground'>
                    Created {format(new Date(agent.createdAt), 'MMM d, yyyy')}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={agent.isActive ? 'default' : 'secondary'}>
                {agent.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardHeader>
            
            <CardContent className='flex-grow'>
              <p className='text-sm text-muted-foreground line-clamp-3 mb-4'>
                {agent.description || 'No description provided'}
              </p>
              
              <div className='space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Model:</span>
                  <span className='font-medium'>{agent.model}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Mode:</span>
                  <span className='font-medium capitalize'>{agent.mode}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Total Calls:</span>
                  <span className='font-medium'>{agent.usageStats.totalCalls}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Avg Response Time:</span>
                  <span className='font-medium'>{agent.usageStats.averageResponseTime}ms</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className='flex justify-between items-center'>
              <div className='flex space-x-2'>
                <Button 
                  size='icon' 
                  variant='ghost' 
                  title='Run Agent'
                >
                  <PlayCircle className='h-4 w-4' />
                </Button>
                <Button 
                  size='icon' 
                  variant='ghost' 
                  title='Settings'
                  onClick={() => {
                    setSelectedAgentId(agent.id)
                    setIsEditDialogOpen(true)
                  }}
                >
                  <Settings className='h-4 w-4' />
                </Button>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon' variant='ghost'>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    {agent.isActive ? 'Deactivate' : 'Activate'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className='text-destructive'>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <AgentCreateDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        agentId={selectedAgentId}
      />
    </>
  )
}