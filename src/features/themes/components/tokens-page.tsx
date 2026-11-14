import { TriangleAlert } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { failingPairs } from '../data/contrast'
import type { TokenSettings } from '../data/themes.type'
import { useThemeT } from '../hooks/useThemeT'
import { BlockFormPage } from './block-form-page'
import { ColorField } from './color-field'
import { FormSection } from './form-section'
import { TextField } from './text-field'

const FONT_ROLES = ['display', 'heading', 'price', 'body'] as const

function TokenWarnings({ value }: { value: TokenSettings }) {
  const t = useThemeT()
  const failing = failingPairs(value.colors)

  return (
    <div className='mb-4 space-y-3'>
      {value.locked_tokens.length > 0 && (
        <Alert>
          <AlertTitle>{t('tokens.lockedTitle')}</AlertTitle>
          <AlertDescription>{t('tokens.lockedBody', { tokens: value.locked_tokens.join(', ') })}</AlertDescription>
        </Alert>
      )}
      {failing.length > 0 && (
        <Alert variant='destructive'>
          <TriangleAlert className='size-4' />
          <AlertTitle>{t('tokens.contrastTitle')}</AlertTitle>
          <AlertDescription>
            {failing.map((pair) => `${pair.fg}/${pair.bg}: ${pair.ratio.toFixed(2)}`).join(' · ')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export function TokensPage() {
  return (
    <BlockFormPage<TokenSettings> block='tokens' titleKey='page.tokens' extra={(value) => <TokenWarnings value={value} />}>
      {(value) => (
        <>
          <FormSection titleKey='section.colors'>
            {Object.keys(value.colors).map((name) => (
              <ColorField key={name} path={`colors.${name}`} locked={value.locked_tokens.includes(name)} />
            ))}
          </FormSection>

          <FormSection titleKey='section.fonts'>
            {FONT_ROLES.map((role) => (
              <TextField key={role} path={`fonts.${role}`} />
            ))}
          </FormSection>

          <FormSection titleKey='section.shape'>
            <TextField path='radius' />
            <TextField path='shadow' />
            <TextField path='spacing.section' />
            <TextField path='spacing.container' />
          </FormSection>
        </>
      )}
    </BlockFormPage>
  )
}
