import { ShieldAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { CustomCodeSettings } from '../data/themes.type'
import { useThemeT } from '../hooks/useThemeT'
import { BlockFormPage } from './block-form-page'
import { CodeField } from './code-field'

function CodeWarning({ value }: { value: CustomCodeSettings }) {
  const t = useThemeT()

  return (
    <div className='mb-4 space-y-3'>
      <Alert variant='destructive'>
        <ShieldAlert className='size-4' />
        <AlertTitle>{t('customCode.dangerTitle')}</AlertTitle>
        <AlertDescription>{t('customCode.dangerBody')}</AlertDescription>
      </Alert>
      <p className='text-sm text-muted-foreground'>
        {value.audit
          ? t('customCode.audit', { by: value.audit.by, at: value.audit.at })
          : t('customCode.auditNone')}
      </p>
    </div>
  )
}

export function CustomCodePage() {
  return (
    <BlockFormPage<CustomCodeSettings>
      block='custom-code'
      titleKey='page.customCode'
      extra={(value) => <CodeWarning value={value} />}
    >
      {() => (
        <>
          <CodeField path='head' />
          <CodeField path='bodyStart' />
          <CodeField path='bodyEnd' />
        </>
      )}
    </BlockFormPage>
  )
}
