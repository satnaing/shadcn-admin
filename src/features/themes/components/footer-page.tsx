import type { FooterSettings } from '../data/themes.type'
import { BlockFormPage } from './block-form-page'
import { FormSection } from './form-section'
import { ImageField } from './image-field'
import { ListEditor } from './list-editor'
import { LocalizedField } from './localized-field'
import { SelectField } from './select-field'
import { SwitchField } from './switch-field'
import { TextField } from './text-field'

const NETWORKS = ['facebook', 'instagram', 'linkedin', 'pinterest', 'behance', 'x'].map((n) => ({ value: n, label: n }))
const SOURCES = ['manual', 'menu'].map((n) => ({ value: n, label: n }))

export function FooterPage() {
  return (
    <BlockFormPage<FooterSettings> block='footer' titleKey='page.footer'>
      {(value) => (
        <>
          <FormSection titleKey='section.general'>
            {/* Q-F1: no front has footer variants yet; options come from the API. */}
            <SelectField path='variant' options={value.variants.map((v) => ({ value: v, label: v }))} />
            <SwitchField path='showScrollTop' />
            <LocalizedField path='brand.name' />
            <LocalizedField path='brand.description' multiline />
            <ImageField path='brand.logo' />
          </FormSection>

          <FormSection titleKey='section.contact'>
            <LocalizedField path='contact.title' />
            <LocalizedField path='contact.address' />
            <TextField path='contact.phone' />
            <TextField path='contact.email' type='email' />
            <TextField path='contact.fax' />
          </FormSection>

          <ListEditor path='columns' makeItem={() => ({ title: {}, source: 'manual', menuId: '', links: [] })}>
            {(p) => (
              <>
                <LocalizedField path={`${p}.title`} />
                <SelectField path={`${p}.source`} options={SOURCES} />
                <TextField path={`${p}.menuId`} />
                <div className='sm:col-span-2'>
                  <ListEditor path={`${p}.links`} makeItem={() => ({ label: {}, href: '' })}>
                    {(lp) => (
                      <>
                        <LocalizedField path={`${lp}.label`} />
                        <TextField path={`${lp}.href`} />
                      </>
                    )}
                  </ListEditor>
                </div>
              </>
            )}
          </ListEditor>

          <ListEditor path='socials' makeItem={() => ({ network: 'facebook', href: '' })}>
            {(p) => (
              <>
                <SelectField path={`${p}.network`} options={NETWORKS} />
                <TextField path={`${p}.href`} />
              </>
            )}
          </ListEditor>

          <ListEditor path='pills' makeItem={() => ({ label: {}, href: '' })}>
            {(p) => (
              <>
                <LocalizedField path={`${p}.label`} />
                <TextField path={`${p}.href`} />
              </>
            )}
          </ListEditor>

          <FormSection titleKey='section.app'>
            <SwitchField path='appDownload.enabled' />
            <LocalizedField path='appDownload.title' />
            <LocalizedField path='appDownload.googlePlay.title' />
            <LocalizedField path='appDownload.googlePlay.subtitle' />
            <TextField path='appDownload.googlePlay.href' />
            <LocalizedField path='appDownload.appStore.title' />
            <LocalizedField path='appDownload.appStore.subtitle' />
            <TextField path='appDownload.appStore.href' />
          </FormSection>

          <FormSection titleKey='section.bottom'>
            <SwitchField path='paymentMethods.enabled' />
            <LocalizedField path='bottomBar.copyright' />
          </FormSection>

          <ListEditor path='bottomBar.links' makeItem={() => ({ label: {}, href: '' })}>
            {(p) => (
              <>
                <LocalizedField path={`${p}.label`} />
                <TextField path={`${p}.href`} />
              </>
            )}
          </ListEditor>
        </>
      )}
    </BlockFormPage>
  )
}
