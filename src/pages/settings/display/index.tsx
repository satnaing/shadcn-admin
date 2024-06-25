import { DisplayForm } from './display-form'
import ContentSection from '../components/content-section'

export default function SettingsDisplay() {
  return (
    <ContentSection
      title='Display'
      desc="Turn items on or off to control what's displayed in the app."
    >
      <DisplayForm />
    </ContentSection>
  )
}
