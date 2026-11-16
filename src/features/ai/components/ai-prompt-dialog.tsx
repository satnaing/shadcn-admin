import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { EntityFormDialog } from '@/components/forms/entity-form-dialog'
import { FormTextareaField } from '@/components/forms/form-textarea-field'
import { promptVariables } from '../data/ai.models'
import { type PromptFormValues, promptSchema } from '../data/ai.schema'
import type { PromptItem } from '../data/ai.type'
import { useAiMutations } from '../hooks/use-ai-mutations'

interface Props {
  onOpenChange: (open: boolean) => void
  /** Prompt being edited. Remount with `key`. */
  item: PromptItem
}

export function AiPromptDialog({ onOpenChange, item }: Props) {
  const { t } = useTranslation('ai')
  const { savePrompt } = useAiMutations(() => onOpenChange(false))
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema(item.prompt)),
    defaultValues: { prompt: item.prompt },
  })

  return (
    <EntityFormDialog
      open
      onOpenChange={onOpenChange}
      form={form}
      title={t('prompts.form.title', { name: t(`prompts.names.${item.identifier}`) })}
      description={t('prompts.form.description', { variables: promptVariables(item.prompt).map((v) => `{${v}}`).join(', ') })}
      isCreate={false}
      isPending={savePrompt.isPending}
      labels={{ saving: t('actions.saving'), saveAndExit: t('actions.save'), updating: t('actions.saving'), updateAndExit: t('actions.save') }}
      onSubmit={form.handleSubmit((values) => savePrompt.mutate({ id: item.id, prompt: values.prompt }))}
      contentClassName='sm:max-w-2xl'
    >
      <FormTextareaField form={form} name='prompt' rows={14} label={t('prompts.form.prompt')} />
    </EntityFormDialog>
  )
}
