import { createLazyFileRoute } from '@tanstack/react-router'
import { PaymentMethodsPage } from '@/features/settings/financial/payment-methods-page'

export const Route = createLazyFileRoute(
  '/_authenticated/settings/financial/payment-methods'
)({
  component: PaymentMethodsPage,
})
