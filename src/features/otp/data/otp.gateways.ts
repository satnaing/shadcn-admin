import { type GatewayKey, SECRET_MASK } from './otp.type'

export interface GatewayField {
  /** Credential name; label, options and hint resolve under `gateways.fields.<name>` etc. */
  name: string
  secret?: boolean
  required?: boolean
  url?: boolean
  hint?: boolean
  options?: readonly string[]
}

/** Credential fields per gateway (AEC `partials/*.blade.php`, env names lower-cased; the `MESSGAE_FROM` typo fixed). */
export const GATEWAY_FIELDS: Record<GatewayKey, readonly GatewayField[]> = {
  twilio: [
    { name: 'sid', required: true },
    { name: 'auth_token', required: true, secret: true },
    { name: 'number' },
    { name: 'channel', options: ['sms', 'whatsapp'] },
  ],
  nexmo: [
    { name: 'key', required: true },
    { name: 'secret', required: true, secret: true },
    { name: 'sender_id', required: true },
  ],
  fast2sms: [
    { name: 'auth_key', required: true, secret: true },
    { name: 'entity_id' },
    { name: 'route', required: true, options: ['dlt_manual', 'p', 't'] },
    { name: 'language', required: true, options: ['english', 'unicode'] },
    { name: 'sender_id' },
  ],
  mimo: [
    { name: 'username', required: true },
    { name: 'password', required: true, secret: true },
    { name: 'sender_id', required: true },
  ],
  mimsms: [
    { name: 'user_name', required: true },
    { name: 'api_key', required: true, secret: true },
    { name: 'sender_id', required: true },
  ],
  msegat: [
    { name: 'api_key', required: true, secret: true },
    { name: 'username', required: true },
    { name: 'user_sender', required: true },
  ],
  sparrow: [
    { name: 'token', required: true, secret: true },
    { name: 'message_from', required: true },
  ],
  ssl_wireless: [
    { name: 'api_token', required: true, secret: true },
    { name: 'sid', required: true },
    { name: 'url', url: true },
  ],
  zender: [
    { name: 'site_url', required: true, url: true },
    { name: 'api_key', required: true, secret: true },
    { name: 'service', options: ['sms', 'whatsapp'] },
    { name: 'whatsapp', hint: true },
    { name: 'device', hint: true },
    { name: 'gateway', hint: true },
    { name: 'sim', hint: true, options: ['1', '2'] },
  ],
}

/** A gateway can be switched on only when every required credential is stored. */
export function isConfigured(key: GatewayKey, credentials: Record<string, string>): boolean {
  return GATEWAY_FIELDS[key].every((f) => !f.required || (credentials[f.name] ?? '').trim() !== '')
}

/** Masks the secrets of a credential set before it leaves the server (the mock follows the API contract). */
export function maskCredentials(key: GatewayKey, credentials: Record<string, string>) {
  const out = { ...credentials }
  for (const f of GATEWAY_FIELDS[key]) if (f.secret && out[f.name]) out[f.name] = SECRET_MASK
  return out
}

/** Incoming secrets equal to the mask mean "unchanged". */
export function mergeCredentials(
  key: GatewayKey,
  stored: Record<string, string>,
  incoming: Record<string, string>
) {
  const out: Record<string, string> = {}
  for (const f of GATEWAY_FIELDS[key]) {
    const value = incoming[f.name] ?? ''
    out[f.name] = f.secret && value === SECRET_MASK ? (stored[f.name] ?? '') : value
  }
  return out
}
