import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EntityFormPage } from '@/components/forms/entity-form-page'
import {
  type CampaignFormValues,
  campaignDefaults,
  campaignSchema,
  campaignToForm,
} from '../data/qrcode-event.schema'
import type { CampaignDetail } from '../data/qrcode-event.type'
import { useQrMutations } from '../hooks/use-qrcode-event-mutations'
import { QrCampaignFields } from './qr-campaign-fields'
import { QrCampaignLimits } from './qr-campaign-limits'

/** `campaign` = loaded record when editing; `undefined` = create. Remount with `key`. */
export function QrCampaignForm({ campaign }: { campaign?: CampaignDetail }) {
  const { t } = useTranslation('qrcode_event')
  const navigate = useNavigate()
  const { createCampaign, updateCampaign } = useQrMutations()
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign ? campaignToForm(campaign) : campaignDefaults,
  })
  const mutation = campaign ? updateCampaign : createCampaign

  const submit = form.handleSubmit((values) => {
    const onSuccess = () => navigate({ to: '/admin/qrcode-event/campaigns' })
    if (campaign) updateCampaign.mutate({ id: campaign.id, values }, { onSuccess })
    else createCampaign.mutate(values, { onSuccess })
  })

  return (
    <EntityFormPage
      backTo='/admin/qrcode-event/campaigns'
      form={form}
      title={t(campaign ? 'campaigns.form.editTitle' : 'campaigns.form.createTitle')}
      description={t('campaigns.form.pageDescription')}
      isCreate={!campaign}
      isPending={mutation.isPending}
      labels={{
        saving: t('actions.saving'),
        saveAndExit: t('actions.save'),
        updating: t('actions.saving'),
        updateAndExit: t('actions.save'),
      }}
      onSubmit={submit}
    >
      <QrCampaignFields form={form} />
      <QrCampaignLimits form={form} />
    </EntityFormPage>
  )
}
