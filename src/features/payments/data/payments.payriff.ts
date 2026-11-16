import { type PayriffSettings, SECRET_MASK } from './payments.type'

export const PAYRIFF_SECRETS = ['test_secret_key', 'production_secret_key'] as const

/** API contract: stored secrets leave the server as the mask (AEC printed them into the page as `value="…"`). */
export function maskPayriff(stored: PayriffSettings): PayriffSettings {
  const masked = { ...stored }
  for (const key of PAYRIFF_SECRETS) if (masked[key]) masked[key] = SECRET_MASK
  return masked
}

/** The mask sent back unchanged keeps the stored secret; anything else replaces it. */
export function mergePayriff(stored: PayriffSettings, incoming: Omit<PayriffSettings, 'active'>): PayriffSettings {
  const next: PayriffSettings = { ...stored, ...incoming }
  for (const key of PAYRIFF_SECRETS) if (incoming[key] === SECRET_MASK) next[key] = stored[key]
  return next
}

/** Payriff can only be switched on when the active mode has a merchant id and a secret key. */
export const isPayriffConfigured = (s: PayriffSettings) =>
  s[`${s.mode}_merchant_id`] !== '' && s[`${s.mode}_secret_key`] !== ''
