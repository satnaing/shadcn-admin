import type { TopbarSettings } from '../data/themes.type'
import { useThemeT } from '../hooks/useThemeT'
import { BlockFormPage } from './block-form-page'
import { FormSection } from './form-section'
import { FormTabs } from './form-tabs'
import { ListEditor } from './list-editor'
import { LocalizedField } from './localized-field'
import { SelectField } from './select-field'
import { SwitchField } from './switch-field'
import { TextField } from './text-field'

const emptyLink = { label: {}, href: '' }

export function TopbarPage() {
  const t = useThemeT()
  const styles = [
    { value: 'dark', label: t('common.dark') },
    { value: 'light', label: t('common.light') },
  ]

  return (
    <BlockFormPage<TopbarSettings> block='topbar' titleKey='page.topbar'>
      {() => (
        <FormTabs
          tabs={[
            {
              value: 'general',
              labelKey: 'section.general',
              content: (
                <FormSection titleKey='section.general'>
                  <SwitchField path='enabled' />
                  <SelectField path='style' options={styles} />
                  <LocalizedField path='support.text' />
                  <TextField path='support.phone' />
                </FormSection>
              ),
            },
            {
              value: 'promo',
              labelKey: 'section.promo',
              content: (
                <FormSection titleKey='section.promo'>
                  <SwitchField path='promoAlert.enabled' />
                  <LocalizedField path='promoAlert.category' />
                  <LocalizedField path='promoAlert.discount' />
                  <LocalizedField path='promoAlert.period' />
                </FormSection>
              ),
            },
            {
              value: 'languages',
              labelKey: 'tab.languages',
              content: (
                <>
                  <ListEditor
                    path='languages'
                    makeItem={() => ({ code: '', label: '', flag: '' })}
                  >
                    {(p) => (
                      <>
                        <TextField path={`${p}.code`} />
                        <TextField path={`${p}.label`} />
                        <TextField path={`${p}.flag`} />
                      </>
                    )}
                  </ListEditor>
                  <TextField path='defaultLanguage' />
                </>
              ),
            },
            {
              value: 'currencies',
              labelKey: 'tab.currencies',
              content: (
                <>
                  <ListEditor
                    path='currencies'
                    makeItem={() => ({ code: '', symbol: '', label: '' })}
                  >
                    {(p) => (
                      <>
                        <TextField path={`${p}.code`} />
                        <TextField path={`${p}.symbol`} />
                        <TextField path={`${p}.label`} />
                      </>
                    )}
                  </ListEditor>
                  <TextField path='defaultCurrency' />
                </>
              ),
            },
            {
              value: 'links',
              labelKey: 'tab.links',
              content: (
                <>
                  <ListEditor
                    path='utilityLinks'
                    makeItem={() => ({ ...emptyLink, icon: '' })}
                  >
                    {(p) => (
                      <>
                        <LocalizedField path={`${p}.label`} />
                        <TextField path={`${p}.href`} />
                        <TextField path={`${p}.icon`} />
                      </>
                    )}
                  </ListEditor>
                  <FormSection titleKey='section.buttons'>
                    <LocalizedField path='ticketLink.label' />
                    <TextField path='ticketLink.href' />
                    <LocalizedField path='campaignsButton.label' />
                    <TextField path='campaignsButton.href' />
                  </FormSection>
                </>
              ),
            },
          ]}
        />
      )}
    </BlockFormPage>
  )
}
