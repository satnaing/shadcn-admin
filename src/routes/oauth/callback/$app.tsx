import { createFileRoute } from '@tanstack/react-router'
import { OauthCallback } from '@/features/oauth/callback'
import z from 'zod'

export const Route = createFileRoute('/oauth/callback/$app')({
  component: OauthCallback,
  validateSearch: z.object({
    code: z.string().optional(),
    auth_code: z.string().optional(),
    state: z.string().optional(),
  }),
})
