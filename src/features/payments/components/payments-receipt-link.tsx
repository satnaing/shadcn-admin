import { useTranslation } from 'react-i18next'

/** Link to an uploaded payment receipt (AEC "Open Reciept"). */
export function PaymentsReceiptLink({ url }: { url: string | null }) {
  const { t } = useTranslation('payments')

  if (!url) return <span className='text-muted-foreground'>—</span>

  return (
    <a href={url} target='_blank' rel='noopener noreferrer' className='text-primary hover:underline'>
      {t('common.receipt')}
    </a>
  )
}
