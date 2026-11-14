import { useEffect, useState } from 'react'
import { Check, TriangleAlert, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { useModuleMutations } from '../hooks/use-modules'

const MAX_MB = 20

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ModuleUploadDialog({ open, onOpenChange }: Props) {
  const { t } = useTranslation('modules')
  const { upload } = useModuleMutations()
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const steps = upload.data?.data.steps

  // Mock progress: the real API streams the upload; here the bar just fills while the request runs.
  useEffect(() => {
    if (!upload.isPending) return
    const timer = setInterval(() => setProgress((p) => Math.min(p + 15, 90)), 60)
    return () => {
      clearInterval(timer)
      setProgress(0)
    }
  }, [upload.isPending])

  const tooBig = !!file && file.size > MAX_MB * 1024 * 1024
  const valid = !!file && /\.zip$/i.test(file.name) && !tooBig

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t('upload.title')}</DialogTitle>
          <DialogDescription>{t('upload.description', { mb: MAX_MB })}</DialogDescription>
        </DialogHeader>
        <Alert variant='destructive'>
          <TriangleAlert className='size-4' />
          <AlertTitle>{t('upload.warningTitle')}</AlertTitle>
          <AlertDescription>{t('upload.warning')}</AlertDescription>
        </Alert>
        <Input
          type='file'
          accept='.zip'
          aria-label={t('upload.file')}
          onChange={(e) => {
            setFile(e.target.files?.[0] ?? null)
            upload.reset()
          }}
        />
        {tooBig && <p className='text-sm text-destructive'>{t('upload.tooBig', { mb: MAX_MB })}</p>}
        {upload.isPending && <Progress value={progress} />}
        {steps && (
          <ul className='space-y-1 text-sm' aria-label={t('upload.result')}>
            {steps.map((s) => (
              <li key={s.key} className='flex items-center gap-2'>
                {s.ok ? <Check className='size-4 text-emerald-500' /> : <X className='size-4 text-destructive' />}
                {t(`upload.steps.${s.key}`)}
              </li>
            ))}
          </ul>
        )}
        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {t('upload.close')}
          </Button>
          <Button disabled={!valid || upload.isPending} onClick={() => file && upload.mutate(file)}>
            {t('upload.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
