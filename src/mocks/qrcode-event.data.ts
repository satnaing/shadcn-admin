import type {
  BatchItem,
  CampaignDetail,
  CheckItem,
  CheckResult,
  CodeListItem,
  CodeStatus,
  PrizeItem,
  PrizeType,
  ProductOption,
  QrSettings,
} from '@/features/qrcode-event/data/qrcode-event.type'

export type CampaignRow = Omit<CampaignDetail, 'prizes_count' | 'codes_count' | 'checked_count' | 'claimed_count'>
export type CodeRow = CodeListItem & {
  claim_note: string
  claimed_by_name: string | null
  ip: string | null
  user_agent: string | null
}

const DAY = 86_400_000
const ago = (days: number, hour = 10) => new Date(Date.now() - days * DAY + hour * 3_600_000 - 12 * 3_600_000).toISOString()
const NAMES = ['Aysel Mammadova', 'Rauf Aliyev', 'Leyla Hasanova', 'Elvin Quliyev', 'Nigar Ismayilova', 'Tural Abbasov', 'Sevinc Rzayeva', 'Kamran Mirzayev']
const CAMPAIGN_NAMES = [
  'Summer Scratch & Win', 'Back to School', 'Black Friday Codes', 'Novruz Gifts', 'Coffee Lovers Draw', 'Tech Week Prizes',
  'Autumn Cashback', 'Kids Day Surprise', 'Winter Warm-up', 'Brand Anniversary', 'Weekend Lucky Codes', 'Spring Refresh',
]
const STATUSES = ['active', 'active', 'paused', 'draft', 'finished', 'active'] as const

export const seedProducts: ProductOption[] = [
  'Wireless Earbuds', 'Smart Watch', 'Coffee Machine', 'Gift Card 50', 'Backpack', 'Power Bank', 'Desk Lamp', 'Bluetooth Speaker',
].map((name, i) => ({ id: i + 1, name }))

export const seedSettings: QrSettings = {
  android_package: 'az.allixwork.shop',
  android_sha256: 'A1:B2:C3:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90:A1:B2:C3:D4:E5:F6:07:18:29:3A:4B:5C:6D:7E:8F:90',
  ios_team_id: 'AB12CD34EF',
  ios_bundle_id: 'az.allixwork.shop',
}

export const seedCampaigns: CampaignRow[] = CAMPAIGN_NAMES.map((name, i) => ({
  id: i + 1,
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
  status: STATUSES[i % STATUSES.length],
  starts_at: ago(60 - i * 4).slice(0, 16),
  ends_at: ago(-30 - i * 5).slice(0, 16),
  code_prefix: name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase(),
  prize_delivery: i % 3 === 0 ? 'wallet' : 'manual',
  is_login_required: i % 4 !== 0,
  max_checks_per_hour: 30,
  max_failed_per_hour: 10,
  block_minutes: 60,
  description: `${name}: scan the code under the label and see if you won.`,
  terms: 'One code can be checked once. Prizes are handed over within 14 days.',
  banner: `https://picsum.photos/seed/qr${i + 1}/600/200`,
}))

const PRIZE_KINDS: { type: PrizeType; title: string; value: number; quantity: number }[] = [
  { type: 'cash', title: '5 AZN balance', value: 5, quantity: 40 },
  { type: 'product', title: 'Product prize', value: 0, quantity: 6 },
  { type: 'gift', title: 'Surprise gift box', value: 0, quantity: 10 },
]

export const seedPrizes: PrizeItem[] = seedCampaigns.flatMap((c, ci) =>
  PRIZE_KINDS.map((k, ki) => ({
    id: ci * 3 + ki + 1,
    campaign_id: c.id,
    type: k.type,
    title: k.type === 'product' ? seedProducts[(ci + ki) % seedProducts.length].name : k.title,
    value: k.value ? k.value * (1 + (ci % 3)) : 0,
    quantity: k.quantity,
    allocated_count: 0,
    claimed_count: 0,
    product_ids: k.type === 'product' ? [seedProducts[(ci + ki) % seedProducts.length].id] : [],
    description: '',
    image: '',
    sort_order: ki,
  }))
)

export const seedBatches: BatchItem[] = Array.from({ length: 14 }, (_, i) => {
  const c = seedCampaigns[i % seedCampaigns.length]
  return {
    id: i + 1, campaign_id: c.id, campaign_name: c.name, quantity: 8 + (i % 3) * 1000, winner_quantity: 2,
    product_id: null, note: i % 2 ? 'Retail pack' : '', created_by_name: 'Admin', created_at: ago(40 - i * 2),
  }
})

const CODE_STATES: CodeStatus[] = ['unused', 'checked', 'unused', 'claimed', 'unused', 'disabled', 'checked', 'unused']
export const codeString = (prefix: string | null, n: number) =>
  `${prefix ?? 'QR'}${(n * 2654435761 >>> 0).toString(36).toUpperCase().padStart(8, '0').slice(0, 8)}`

export const seedCodes: CodeRow[] = seedBatches.flatMap((b, bi) => {
  const campaign = seedCampaigns.find((c) => c.id === b.campaign_id)!
  const prizes = seedPrizes.filter((p) => p.campaign_id === b.campaign_id)
  return Array.from({ length: 8 }, (_, k) => {
    const id = bi * 8 + k + 1
    const status = CODE_STATES[(bi + k) % CODE_STATES.length]
    const prize = k < 2 ? prizes[(bi + k) % prizes.length] : undefined
    const revealed = status === 'checked' || status === 'claimed'
    return {
      id, campaign_id: campaign.id, campaign_name: campaign.name, batch_id: b.id,
      prize_id: prize?.id ?? null, prize_title: prize?.title ?? null,
      code: codeString(campaign.code_prefix, id), status,
      user_name: revealed ? NAMES[id % NAMES.length] : null,
      checked_at: revealed ? ago(id % 25) : null,
      claimed_at: status === 'claimed' ? ago(id % 20) : null,
      created_at: b.created_at, claim_note: status === 'claimed' ? 'Handed over at the store' : '',
      claimed_by_name: status === 'claimed' ? 'Admin' : null,
      ip: revealed ? `10.0.${id % 8}.${(id * 7) % 250}` : null, user_agent: revealed ? 'allixwork-app/1.0 (Android 14)' : null,
    }
  })
})
for (const code of seedCodes) {
  const prize = seedPrizes.find((p) => p.id === code.prize_id)
  if (prize) {
    prize.allocated_count++
    if (code.status === 'claimed') prize.claimed_count++
  }
}

const RESULTS: CheckResult[] = ['win', 'lose', 'lose', 'already_checked', 'invalid', 'used', 'lose', 'blocked', 'disabled']
export const seedChecks: CheckItem[] = Array.from({ length: 64 }, (_, i) => {
  const code = seedCodes[(i * 5) % seedCodes.length]
  const result = RESULTS[i % RESULTS.length]
  return {
    id: i + 1, qr_code_id: result === 'invalid' ? null : code.id, campaign_id: code.campaign_id,
    campaign_name: code.campaign_name, code_input: result === 'invalid' ? `ZZ${i}9X${i}` : code.code, result,
    user_name: i % 4 === 0 ? null : NAMES[i % NAMES.length], ip: `192.168.${i % 6}.${(i * 11) % 250}`,
    source: i % 3 === 0 ? 'web' : 'app', created_at: ago(i % 30, 8 + (i % 12)),
  }
})
