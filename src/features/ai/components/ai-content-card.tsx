import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { FormCard } from '@/components/forms/form-card'
import { FormInputField } from '@/components/forms/form-input-field'
import { FormSelectField } from '@/components/forms/form-select-field'
import { FormSwitchField } from '@/components/forms/form-switch-field'
import { PERMISSIONS } from '@/shared/permissions'
import { CONTENT_MODELS, modelKey } from '../data/ai.models'
import { type ContentFormValues, contentSchema } from '../data/ai.schema'
import type { ContentAiSettings } from '../data/ai.type'
import { useAiMutations } from '../hooks/use-ai-mutations'

/** "Google AI (Gemini) Settings": product content generation for admins and sellers. */
export function AiContentCard({ settings }: { settings: ContentAiSettings }) {
  const { t } = useTranslation('ai')
  const { saveContent } = useAiMutations()
  const form = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: settings as ContentFormValues,
  })

  return (
    <FormCard
      form={form}
      title={t('settings.content.title')}
      description={t('settings.content.description')}
      permission={PERMISSIONS.AI.SETTINGS_MANAGE}
      pending={saveContent.isPending}
      labels={{ save: t('actions.save'), saving: t('actions.saving') }}
      onSubmit={(values) => saveContent.mutate(values)}
    >
      <FormSwitchField form={form} name='enabled' label={t('settings.content.enabled')} />
      <FormSelectField
        form={form}
        name='model'
        label={t('settings.model')}
        options={CONTENT_MODELS.map((m) => ({ value: m, label: t(modelKey(m)) }))}
      />
      <FormInputField form={form} name='api_key' type='password' label={t('settings.apiKey')} hint={t('settings.apiKeyHint')} />
      <FormInputField
        form={form}
        name='seller_monthly_token_limit'
        type='number'
        label={t('settings.content.sellerLimit')}
        hint={t('settings.content.sellerLimitHint')}
      />
    </FormCard>
  )
}
