import { useQrCampaign } from '../hooks/use-qrcode-event'
import { QrCampaignForm } from './qr-campaign-form'

export function QrCampaignEditPage({ id }: { id: string }) {
  const { data } = useQrCampaign(id)
  if (!data) return <div className='p-6' aria-busy='true' />

  return <QrCampaignForm key={data.data.id} campaign={data.data} />
}
