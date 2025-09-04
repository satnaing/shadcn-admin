import { useState } from 'react'
import { type CrmListInput, type Trigger } from '@/graphql/global/types.generated'
import { useCrmListsQuery } from '@/graphql/operations/operations.generated'
import uniqBy from 'lodash/uniqBy'
import { toast } from 'sonner'
import { MultiAsyncSelect } from '@/components/ui/async-multi-select'
import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormItem, FormLabel } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Loadable } from '@/components/loadable'
import { useTriggerUpdateMutation } from '@/features/plays/graphql/operations.generated'

interface TriggerConfigExcludeListsProps {
  trigger: Trigger
}

export function TriggerConfigExcludeLists({ trigger }: TriggerConfigExcludeListsProps) {
  const [crmListsSearchQuery, setCrmListsSearchQuery] = useState('')
  const [selectedLists, setSelectedLists] = useState<CrmListInput[]>(trigger.excludeLists || [])
  const [updateTrigger, { loading: updateTriggerLoading }] = useTriggerUpdateMutation()

  const { data: crmListsData, loading: crmListsLoading } = useCrmListsQuery({
    variables: {
      q: crmListsSearchQuery,
    },
    skip: !crmListsSearchQuery,
  })

  const crmLists = crmListsData?.crmLists.data || []

  const crmListsOptions = crmLists.map((list) => ({
    label: list.name,
    value: list.listId,
  }))

  const triggerLists = ((trigger.excludeLists || []) as CrmListInput[]).map((list) => ({
    label: list.name,
    value: list.id,
  }))

  const allOptions = uniqBy([...triggerLists, ...crmListsOptions], 'value')

  const handleSave = async () => {
    await updateTrigger({
      variables: { input: { excludeLists: selectedLists, id: trigger.id } },
    })

    toast.success('Exclude lists updated successfully')
  }

  return (
    <Loadable>
      <FormItem>
        <FormLabel>Excluded Lists</FormLabel>
        <FormDescription>The lists to exclude from the trigger</FormDescription>
        <FormControl>
          <MultiAsyncSelect
            async
            loading={!!crmListsLoading}
            options={allOptions}
            value={selectedLists.map((list) => list.id)}
            placeholder='Select excluded lists'
            onValueChange={(v) => {
              setSelectedLists(
                allOptions
                  .filter((option) => v.includes(option.value))
                  .map((option) => ({
                    id: option.value,
                    name: option.label,
                  }))
              )
            }}
            onSearch={(v) => setCrmListsSearchQuery(v)}
          />
        </FormControl>
      </FormItem>
      <div className='flex justify-end'>
        <Button onClick={handleSave} loading={updateTriggerLoading}>
          Save Lists
        </Button>
      </div>
      <Separator />
    </Loadable>
  )
}
