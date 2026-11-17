import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MediaPicker } from '@/components/shared/media/media-picker'
import { refsToUrl, urlToRefs } from '@/components/shared/media/media.logic'
import { cn } from '@/lib/utils'

export interface ImagePickerProps {
  value?: string | null
  onChange: (value: string) => void
  label?: string
  id?: string
  className?: string
  disabled?: boolean
}

/** One image kept as a URL string: pick or upload through the media library, or paste an external URL. */
export function ImagePicker({ value, onChange, label, id = 'image-picker', className, disabled }: ImagePickerProps) {
  const { t } = useTranslation('media')

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <MediaPicker value={urlToRefs(value)} onChange={(refs) => onChange(refsToUrl(refs))} disabled={disabled} />
      <Input
        id={id}
        type='url'
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('imagePicker.urlPlaceholder')}
        disabled={disabled}
      />
    </div>
  )
}
