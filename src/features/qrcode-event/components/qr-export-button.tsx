import { Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface Props {
  onExport: () => void
  isPending: boolean
}

export function QrExportButton({ onExport, isPending }: Props) {
  const { t } = useTranslation('qrcode_event')

  return (
    <Button variant='outline' onClick={onExport} disabled={isPending}>
      <Download className='me-2 size-4' />
      {t('actions.export')}
    </Button>
  )
}
