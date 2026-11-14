import type { HeaderSettings } from '../data/themes.type'
import { BlockFormPage } from './block-form-page'
import { FormSection } from './form-section'
import { ImageField } from './image-field'
import { LocalizedField } from './localized-field'
import { SelectField } from './select-field'
import { SwitchField } from './switch-field'
import { TextField } from './text-field'

const TOGGLES = ['search', 'cart', 'wishlist', 'login', 'register', 'themeToggle'] as const

export function HeaderPage() {
  return (
    <BlockFormPage<HeaderSettings> block='header' titleKey='page.header'>
      {(value) => (
        <>
          <FormSection titleKey='section.general'>
            {/* Q-F1: no front has header variants yet; options come from the API (one `default`). */}
            <SelectField path='variant' options={value.variants.map((v) => ({ value: v, label: v }))} />
            <SwitchField path='sticky' />
            <TextField path='menuId' />
            <LocalizedField path='categoriesButtonText' />
          </FormSection>

          <FormSection titleKey='section.logo'>
            <ImageField path='logo.light' />
            <ImageField path='logo.dark' />
            <ImageField path='logo.band' />
            <TextField path='logo.text' />
            <TextField path='logo.href' />
          </FormSection>

          <FormSection titleKey='section.texts'>
            <LocalizedField path='search.placeholder' />
            <LocalizedField path='account.label' />
            <LocalizedField path='account.actionText' />
            <LocalizedField path='support.label' />
            <TextField path='support.phone' />
          </FormSection>

          <FormSection titleKey='section.chat'>
            <LocalizedField path='chat.label' />
            <TextField path='chat.href' />
            <LocalizedField path='chat.onlineText' />
          </FormSection>

          {/* Q-F2: the fronts always render these blocks, so the switches stay disabled. */}
          <FormSection titleKey='section.visibility'>
            {TOGGLES.map((name) => (
              <SwitchField key={name} path={`show.${name}`} unsupported />
            ))}
          </FormSection>
        </>
      )}
    </BlockFormPage>
  )
}
