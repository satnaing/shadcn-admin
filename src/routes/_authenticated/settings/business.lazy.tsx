import { createLazyFileRoute } from '@tanstack/react-router'
import BusinessProfileForm from '@/features/settings/business'

export const Route = createLazyFileRoute('/_authenticated/settings/business')({
  component: BusinessProfileForm,
})
