import { createFileRoute } from '@tanstack/react-router'
import { RuleVersions } from '@/features/rules/versions'

export const Route = createFileRoute('/_authenticated/rules/versions')({
  component: RuleVersions,
})
