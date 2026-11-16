import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

interface Props {
  title: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (value: boolean) => void
}

/** One instant-save switch card (AEC `updateSettings`: toggling saves immediately). */
export function OtpSettingCard({ title, description, checked, disabled, onChange }: Props) {
  return (
    <Card>
      <CardContent className='flex items-start justify-between gap-4'>
        <div className='space-y-1'>
          <h3 className='text-base font-semibold'>{title}</h3>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
        <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} aria-label={title} />
      </CardContent>
    </Card>
  )
}
