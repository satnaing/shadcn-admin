import { ImagePlus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface ImagePickerProps {
  value?: string | null
  onChange: (value: string) => void
  /** Verilərsə "fayl seç" inputu görünür və yükləmədən qaytarılan URL `onChange`-ə ötürülür. */
  onUpload?: (file: File) => Promise<string>
  label?: string
  id?: string
  className?: string
  disabled?: boolean
}

export function ImagePicker({
  value,
  onChange,
  onUpload,
  label,
  id = 'image-picker',
  className,
  disabled,
}: ImagePickerProps) {
  const { t } = useTranslation('media')
  const fileId = `${id}-file`

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !onUpload) return
    const url = await onUpload(file)
    if (url) onChange(url)
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className='flex items-start gap-3'>
        <div className='flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted'>
          {value ? (
            <img src={value} alt='' loading='lazy' className='h-full w-full object-cover' />
          ) : (
            <ImagePlus className='h-6 w-6 text-muted-foreground' />
          )}
        </div>

        <div className='flex-1 space-y-2'>
          <Input
            id={id}
            type='url'
            value={value ?? ''}
            onChange={(event) => onChange(event.target.value)}
            placeholder={t('imagePicker.urlPlaceholder')}
            disabled={disabled}
          />

          {onUpload && (
            <div className='space-y-1'>
              <Label htmlFor={fileId} className='text-xs text-muted-foreground'>
                {t('imagePicker.upload')}
              </Label>
              <Input
                id={fileId}
                type='file'
                accept='image/*'
                onChange={handleFile}
                disabled={disabled}
              />
            </div>
          )}

          {value && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='gap-1'
              onClick={() => onChange('')}
              disabled={disabled}
            >
              <Trash2 className='h-4 w-4' />
              {t('imagePicker.clear')}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
