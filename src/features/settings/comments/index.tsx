import ContentSection from '../components/content-section'
import { CommentsForm } from './comments-form'

export default function SettingsNotifications() {
  return (
    <ContentSection
      title='Notifications'
      desc='Configure how you receive notifications.'
    >
      <CommentsForm />
    </ContentSection>
  )
}
