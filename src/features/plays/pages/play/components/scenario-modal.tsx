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
import Confirmable from '@/components/confirmable'
import { usePlaybookScenariosDeleteMutation } from '../../../graphql/operations.generated'
import { ScenarioForm } from './scenario-form'

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
  const [deleteScenarios, { loading: deleting }] = usePlaybookScenariosDeleteMutation()

  const handleFormSuccess = () => {
    onSuccess()
    handleClose()
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
          <ScenarioForm
            mode={mode}
            playbookId={playbookId}
            scenario={scenario}
            onSuccess={handleFormSuccess}
            formId='scenario-form'
            showButtons={false}
            disabled={deleting}
          />
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
                <Button variant='destructive' size='sm' disabled={deleting}>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </Button>
              </Confirmable>
            )}
          </div>

          <div className='flex gap-2'>
            <Button variant='outline' onClick={handleClose} disabled={deleting}>
              Cancel
            </Button>
            <Button type='submit' form='scenario-form' disabled={deleting}>
              {mode === 'edit' ? 'Save Changes' : 'Create Scenario'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
