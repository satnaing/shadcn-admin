import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useAgents } from './agents-provider'
import { type Agent } from '../data/schema'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  prompt: z.string().min(1, 'Prompt is required'),
  model: z.string().min(1, 'Model is required'),
  mode: z.enum(['chat', 'task'], {
    errorMap: () => ({ message: 'Please select a mode' }),
  }),
  isActive: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface AgentCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentId?: string | null
}

export function AgentCreateDialog({ open, onOpenChange, agentId }: AgentCreateDialogProps) {
  const { addAgent, editAgent, fetchAgentById } = useAgents()
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      prompt: '',
      model: '',
      mode: 'chat',
      isActive: true,
    },
  })

  useEffect(() => {
    if (open && agentId) {
      const agent = fetchAgentById(agentId)
      if (agent) {
        reset({
          name: agent.name,
          description: agent.description || '',
          prompt: agent.prompt,
          model: agent.model,
          mode: agent.mode,
          isActive: agent.isActive,
        })
      }
    } else if (open) {
      reset({
        name: '',
        description: '',
        prompt: '',
        model: '',
        mode: 'chat',
        isActive: true,
      })
    }
  }, [open, agentId, fetchAgentById, reset])

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    try {
      if (agentId) {
        await editAgent(agentId, values)
      } else {
        await addAgent(values)
      }
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save agent:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{agentId ? 'Edit Agent' : 'Create Agent'}</DialogTitle>
          <DialogDescription>
            {agentId ? 'Update the settings for your agent' : 'Create a new AI agent to automate tasks or assist with conversations'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            <Label htmlFor='name'>Agent Name</Label>
            <Input 
              id='name' 
              placeholder='Enter agent name' 
              {...register('name')}
            />
            {errors.name && <p className='text-sm text-destructive'>{errors.name.message}</p>}
          </div>
          
          <div className='space-y-4'>
            <Label htmlFor='description'>Description</Label>
            <Input 
              id='description' 
              placeholder='Enter a brief description of what this agent does' 
              {...register('description')}
            />
          </div>
          
          <div className='space-y-4'>
            <Label htmlFor='prompt'>System Prompt</Label>
            <Textarea 
              id='prompt' 
              placeholder="Enter the system prompt that will guide the agent's behavior" 
              className='min-h-[200px]' 
              {...register('prompt')}
            />
            {errors.prompt && <p className='text-sm text-destructive'>{errors.prompt.message}</p>}
          </div>
          
          <div className='space-y-4'>
            <Label htmlFor='model'>Model</Label>
            <Select 
              {...register('model')} 
              onValueChange={(value) => register('model').onChange({ target: { value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a model' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='gpt-4'>GPT-4</SelectItem>
                <SelectItem value='gpt-3.5-turbo'>GPT-3.5 Turbo</SelectItem>
                <SelectItem value='claude-3-opus'>Claude 3 Opus</SelectItem>
                <SelectItem value='claude-3-sonnet'>Claude 3 Sonnet</SelectItem>
                <SelectItem value='gemini-pro'>Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
            {errors.model && <p className='text-sm text-destructive'>{errors.model.message}</p>}
          </div>
          
          <div className='space-y-4'>
            <Label>Working Mode</Label>
            <RadioGroup 
              defaultValue='chat' 
              {...register('mode')}
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='chat' id='mode-chat' />
                <Label htmlFor='mode-chat'>Chat Mode</Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='task' id='mode-task' />
                <Label htmlFor='mode-task'>Task Mode</Label>
              </div>
            </RadioGroup>
            {errors.mode && <p className='text-sm text-destructive'>{errors.mode.message}</p>}
          </div>
          
          <div className='flex items-center space-x-2'>
            <input 
              type='checkbox' 
              id='isActive' 
              className='h-4 w-4' 
              {...register('isActive')}
            />
            <Label htmlFor='isActive'>Agent is active</Label>
          </div>
          
          <DialogFooter className='pt-4'>
            <Button type='button' variant='secondary' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Saving...' : agentId ? 'Save Changes' : 'Create Agent'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}