import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormCard } from '@/components/forms/form-card'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import { PERMISSIONS } from '@/shared/permissions'
import { TRANSLATE_MODELS, modelKey } from '../data/ai.models'
import { type TranslateFormValues, translateSchema } from '../data/ai.schema'
import type { TranslateAiSettings } from '../data/ai.type'
import { useAiMutations } from '../hooks/use-ai-mutations'

/** Addon `ai_translate` settings: its own key and model, independent of the content AI. */
export function AiTranslateCard({ settings }: { settings: TranslateAiSettings }) {
  const { t } = useTranslation('ai')
  const { saveTranslate } = useAiMutations()
  const form = useForm<TranslateFormValues>({
    resolver: zodResolver(translateSchema),
    defaultValues: settings as TranslateFormValues,
  })

  return (
    <FormCard
      form={form}
      title={t('settings.translate.title')}
      description={t('settings.translate.description')}
      permission={PERMISSIONS.AI.SETTINGS_MANAGE}
      pending={saveTranslate.isPending}
      labels={{ save: t('actions.save'), saving: t('actions.saving') }}
      onSubmit={(values) => saveTranslate.mutate(values)}
    >
      <FormSwitchField form={form} name='enabled' label={t('settings.translate.enabled')} />
      <FormSelectField
        form={form}
        name='model'
        label={t('settings.model')}
        options={TRANSLATE_MODELS.map((m) => ({ value: m, label: t(modelKey(m)) }))}
      />
      <FormInputField form={form} name='api_key' type='password' label={t('settings.apiKey')} hint={t('settings.translate.apiKeyHint')} />
    </FormCard>
  )
}
