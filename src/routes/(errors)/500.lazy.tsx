import { createLazyFileRoute } from '@tanstack/react-router'
import GeneralError from '@/features/errors/general-error'

export const Route = createLazyFileRoute('/(errors)/500')({
  component: GeneralError,
})
