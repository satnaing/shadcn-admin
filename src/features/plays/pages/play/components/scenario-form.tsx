import { useEffect } from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import ActionPlanEditor from '@/features/plays/pages/play/components/action-plan-editor'
import {
  usePlaybookScenarioUpdateMutation,
  usePlaybookScenarioCreateMutation,
} from '../../../graphql/operations.generated'

const scenarioFormSchema = z.object({
  name: z.string().min(1, 'Scenario name is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  actionPlan: z.string().min(1, 'Action plan is required').trim(),
})

export type ScenarioFormData = z.infer<typeof scenarioFormSchema>

interface ScenarioFormProps {
  mode: 'create' | 'edit'
  playbookId?: string
  scenario?: {
    id: string
    name: string
    description?: string | null
    actionPlan?: string | null
  } | null
  onSuccess: (() => void) | ((data: ScenarioFormData) => void)
  formId?: string
  showButtons?: boolean
  onCancel?: () => void
  disabled?: boolean
  skipMutation?: boolean // When true, just calls onSuccess with form data
}

export function ScenarioForm({
  mode,
  playbookId,
  scenario,
  onSuccess,
  formId = 'scenario-form',
  showButtons = true,
  onCancel,
  disabled = false,
  skipMutation = false,
}: ScenarioFormProps) {
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

  const loading = skipMutation
    ? form.formState.isSubmitting || disabled
    : updating || creating || form.formState.isSubmitting || disabled

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
  }, [scenario, mode, form])

  const onSubmit = async (data: ScenarioFormData) => {
    try {
      if (skipMutation) {
        onSuccess(data)
        if (mode === 'create') {
          form.reset()
        }
        return
      }

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

      onSuccess(data)
    } catch (error: any) {
      toast.error(`Failed to ${mode} scenario: ${error.message}`)
    }
  }

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className='space-y-6 py-4'>
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
              <FormLabel>When (Condition)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Describe the condition that activates this scenario'
                  rows={4}
                  disabled={loading}
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Tell Swan when it should classify an event to this sceario.
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
              <FormLabel>Then (Action Plan)</FormLabel>
              <FormControl>
                <ActionPlanEditor
                  value={field.value}
                  onChange={field.onChange}
                  disabled={loading}
                />
              </FormControl>
              <FormDescription>
                Provide detailed steps that will be executed when this scenario runs. Use "#" for
                channels & HubSpot lists, or "@" for users.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {showButtons && (
          <div className='flex justify-end gap-2'>
            {onCancel && (
              <Button variant='outline' onClick={onCancel} disabled={loading} type='button'>
                Cancel
              </Button>
            )}
            <Button type='submit' loading={loading}>
              {mode === 'edit' ? 'Save Changes' : 'Create Scenario'}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
