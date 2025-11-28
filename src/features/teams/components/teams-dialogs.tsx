import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Team } from '../data/teams'
import { useTeams } from './teams-provider'
import { Plus, Edit } from 'lucide-react'

const teamSchema = z.object({
  name: z.string().min(1, 'Team name is required'),
  description: z.string().optional(),
  visibility: z.enum(['public', 'private']).default('private'),
})

type TeamFormValues = z.infer<typeof teamSchema>

export function TeamsDialogs({ editingTeam: externalEditingTeam, onCloseEdit }: { editingTeam?: Team; onCloseEdit?: () => void }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [internalEditingTeam, setInternalEditingTeam] = useState<Team | null>(null)
  const { addTeam, updateTeam } = useTeams()

  useEffect(() => {
    if (externalEditingTeam) {
      setInternalEditingTeam(externalEditingTeam)
      setIsEditDialogOpen(true)
    }
  }, [externalEditingTeam])

  const createForm = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: 'private',
    },
  })

  const editForm = useForm<TeamFormValues>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: '',
      description: '',
      visibility: 'private',
    },
  })

  useEffect(() => {
    if (internalEditingTeam) {
      editForm.reset({
        name: internalEditingTeam.name,
        description: internalEditingTeam.description,
        visibility: internalEditingTeam.visibility,
      })
    }
  }, [internalEditingTeam, editForm])

  const handleCreateTeam = (values: TeamFormValues) => {
    const newTeam: Team = {
      id: `TEAM-${Math.floor(Math.random() * 9000) + 1000}`,
      name: values.name,
      description: values.description || '',
      coverImage: `https://picsum.photos/800/200?random=${Math.floor(Math.random() * 1000)}`,
      visibility: values.visibility,
      createdAt: new Date(),
      updatedAt: new Date(),
      membersCount: 1,
      isArchived: false,
    }
    addTeam(newTeam)
    setIsCreateDialogOpen(false)
    createForm.reset()
  }

  const handleEditTeam = (values: TeamFormValues) => {
    if (!internalEditingTeam) return
    const updatedTeam: Team = {
      ...internalEditingTeam,
      name: values.name,
      description: values.description || '',
      visibility: values.visibility,
      updatedAt: new Date(),
    }
    updateTeam(updatedTeam)
    setIsEditDialogOpen(false)
    setInternalEditingTeam(null)
    if (onCloseEdit) {
      onCloseEdit()
    }
  }

  const handleOpenEditDialog = (team: Team) => {
    setInternalEditingTeam(team)
    setIsEditDialogOpen(true)
  }

  return (
    <>
      {/* Create Team Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className='mr-2 h-4 w-4' />
            Create Team
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateTeam)} className='space-y-4'>
              <FormField
                control={createForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter team name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter team description' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name='visibility'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select visibility' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='public'>Public</SelectItem>
                        <SelectItem value='private'>Private</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end space-x-2'>
                <Button variant='outline' onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type='submit'>Create Team</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          setInternalEditingTeam(null)
          if (onCloseEdit) {
            onCloseEdit()
          }
        }
      }}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditTeam)} className='space-y-4'>
              <FormField
                control={editForm.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter team name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter team description' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name='visibility'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select visibility' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='public'>Public</SelectItem>
                        <SelectItem value='private'>Private</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-end space-x-2'>
                <Button variant='outline' onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type='submit'>Save Changes</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
