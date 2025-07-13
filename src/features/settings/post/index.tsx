import ContentSection from '../components/content-section'
import { PostForm } from './post-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Account'
      desc='Update your account settings. Set your preferred language and
          timezone.'
    >
      <PostForm />
    </ContentSection>
  )
}
