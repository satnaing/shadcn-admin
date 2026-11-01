import { z } from 'zod'

const envSchema = z.object({
  VITE_BASE_NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .catch('development'),
  VITE_BASE_URL: z.string().min(1),
  VITE_API_MOCK: z.enum(['0', '1']).catch('0'),
})

// import.meta.env is parsed by Vite, so we can't use process.env
const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors
  )
  throw new Error('Invalid environment variables')
}

export const env = parsedEnv.data
