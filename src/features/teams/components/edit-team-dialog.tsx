import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Team, TeamVisibility } from '../types'

const editTeamSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(50, 'Team name must be less than 50 characters'),
  description: z.string().max(200, 'Description must be less than 200 characters').optional(),
  visibility: z.enum(['public', 'private', 'invite-only']).default('private'),
})

type EditTeamFormValues = z.infer<typeof editTeamSchema>

interface EditTeamDialogProps {
  team: Team
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (team: Team) => void
}

export function EditTeamDialog({ team, open, onOpenChange, onUpdate }: EditTeamDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EditTeamFormValues>({
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      name: team.name,
      description: team.description,
      visibility: team.visibility,
    },
  })

  const handleSubmit = async (values: EditTeamFormValues) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement team update API call
      console.log('Updating team:', values)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedTeam: Team = {
        ...team,
        ...values,
        updatedAt: new Date(),
      }
      
      onUpdate(updatedTeam)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update team:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit Team</DialogTitle>
          <DialogDescription>
            Update your team's information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
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
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder='Enter team description' 
                      className='resize-none' 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='visibility'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select visibility' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='public'>Public</SelectItem>
                      <SelectItem value='private'>Private</SelectItem>
                      <SelectItem value='invite-only'>Invite Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant='outline' onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Team'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
