import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Confirmable from '@/components/confirmable'
import {
  usePlaybookScenarioUpdateMutation,
  usePlaybookScenarioCreateMutation,
  usePlaybookScenariosDeleteMutation,
} from '../../../graphql/operations.generated'

const scenarioFormSchema = z.object({
  name: z.string().min(1, 'Scenario name is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  actionPlan: z.string().min(1, 'Action plan is required').trim(),
})

type ScenarioFormData = z.infer<typeof scenarioFormSchema>

interface ScenarioModalProps {
  mode: 'create' | 'edit'
  playbookId?: string
  scenario?: {
    id: string
    name: string
    description?: string | null
    actionPlan?: string | null
  } | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ScenarioModal({
  mode,
  playbookId,
  scenario,
  isOpen,
  onClose,
  onSuccess,
}: ScenarioModalProps) {
  const form = useForm<ScenarioFormData>({
    resolver: zodResolver(scenarioFormSchema),
    defaultValues: {
      name: '',
      description: '',
      actionPlan: '',
    },
  })

  const [updateScenario, { loading: updating }] = usePlaybookScenarioUpdateMutation()
  const [createScenario, { loading: creating }] = usePlaybookScenarioCreateMutation()
  const [deleteScenarios, { loading: deleting }] = usePlaybookScenariosDeleteMutation()

  const loading = updating || creating || deleting || form.formState.isSubmitting

  useEffect(() => {
    if (mode === 'edit' && scenario) {
      form.reset({
        name: scenario.name || '',
        description: scenario.description || '',
        actionPlan: scenario.actionPlan || '',
      })
    } else if (mode === 'create') {
      form.reset({
        name: '',
        description: '',
        actionPlan: '',
      })
    }
  }, [scenario, mode, isOpen, form])

  const onSubmit = async (data: ScenarioFormData) => {
    try {
      if (mode === 'edit' && scenario) {
        await updateScenario({
          variables: {
            input: {
              id: scenario.id,
              name: data.name,
              description: data.description,
              actionPlan: data.actionPlan,
            },
          },
        })
        toast.success('Scenario updated successfully')
      } else if (mode === 'create' && playbookId) {
        await createScenario({
          variables: {
            input: {
              playbookId,
              name: data.name,
              description: data.description,
              actionPlan: data.actionPlan,
            },
          },
        })
        toast.success('Scenario created successfully')
      }

      onSuccess()
      handleClose()
    } catch (error: any) {
      toast.error(`Failed to ${mode} scenario: ${error.message}`)
    }
  }

  const handleDelete = async () => {
    if (!scenario || mode !== 'edit') return

    try {
      const result = await deleteScenarios({
        variables: { input: { ids: [scenario.id] } },
      })

      if (result.data?.playbookScenariosDelete.success) {
        toast.success('Scenario deleted successfully')
        onSuccess()
        handleClose()
      } else {
        throw new Error('Failed to delete scenario')
      }
    } catch (error: any) {
      toast.error(`Failed to delete scenario: ${error.message}`)
    }
  }

  const handleClose = async () => {
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='max-w-4xl' scrollable>
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? 'Edit Scenario' : 'Create New Scenario'}</DialogTitle>
          <DialogDescription>
            {mode === 'edit'
              ? 'Update the scenario details below'
              : 'Add a new scenario to this playbook'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <Form {...form}>
            <form
              id='scenario-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6 py-4'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete='off'
                        placeholder='Scenario name'
                        disabled={loading}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Give your scenario a clear, descriptive name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Describe the condition that triggers this scenario'
                        rows={4}
                        disabled={loading}
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain in what situations this scenario applies
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='actionPlan'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Action Plan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Define the action plan for this scenario'
                        rows={6}
                        disabled={loading}
                        className='resize-none'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide detailed steps that will be executed when this scenario runs
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </DialogBody>

        <DialogFooter className='flex items-center justify-between'>
          <div>
            {mode === 'edit' && (
              <Confirmable
                onConfirm={handleDelete}
                titleText='Delete Scenario'
                bodyText='Are you sure you want to delete this scenario? This action cannot be undone.'
                buttonText='Delete'
                variant='danger'
                isLoading={deleting}
              >
                <Button variant='destructive' size='sm' disabled={loading}>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </Button>
              </Confirmable>
            )}
          </div>

          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type='submit' form='scenario-form' loading={loading}>
              {mode === 'edit' ? 'Save Changes' : 'Create Scenario'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
