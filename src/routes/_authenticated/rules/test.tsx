import { createFileRoute } from '@tanstack/react-router'
import { RuleTest } from '@/features/rules/test'

export const Route = createFileRoute('/_authenticated/rules/test')({
  component: RuleTest,
})
