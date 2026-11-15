export type CampaignStatus = 'draft' | 'active' | 'paused' | 'finished'
export type PrizeDelivery = 'manual' | 'wallet'
export type PrizeType = 'cash' | 'product' | 'gift'
export type CodeStatus = 'unused' | 'checked' | 'claimed' | 'disabled'
export type CheckResult = 'win' | 'lose' | 'used' | 'already_checked' | 'invalid' | 'disabled' | 'blocked'

export const CAMPAIGN_STATUSES: CampaignStatus[] = ['draft', 'active', 'paused', 'finished']
export const PRIZE_TYPES: PrizeType[] = ['cash', 'product', 'gift']
export const CODE_STATUSES: CodeStatus[] = ['unused', 'checked', 'claimed', 'disabled']
export const CHECK_RESULTS: CheckResult[] = ['win', 'lose', 'used', 'already_checked', 'invalid', 'disabled', 'blocked']

export interface CampaignListItem {
  id: number
  name: string
  slug: string
  status: CampaignStatus
  starts_at: string | null
  ends_at: string | null
  code_prefix: string | null
  prize_delivery: PrizeDelivery
  prizes_count: number
  codes_count: number
  checked_count: number
  claimed_count: number
}

export interface CampaignDetail extends CampaignListItem {
  is_login_required: boolean
  max_checks_per_hour: number
  max_failed_per_hour: number
  block_minutes: number
  description: string
  terms: string
  banner: string
}

export interface PrizeItem {
  id: number
  campaign_id: number
  type: PrizeType
  title: string
  value: number
  quantity: number
  allocated_count: number
  claimed_count: number
  product_ids: number[]
  description: string
  image: string
  sort_order: number
}

export interface ProductOption {
  id: number
  name: string
}

export interface BatchItem {
  id: number
  campaign_id: number
  campaign_name: string
  quantity: number
  winner_quantity: number
  product_id: number | null
  note: string
  created_by_name: string
  created_at: string
}

export interface CodeListItem {
  id: number
  campaign_id: number
  campaign_name: string
  batch_id: number | null
  prize_id: number | null
  prize_title: string | null
  code: string
  status: CodeStatus
  user_name: string | null
  checked_at: string | null
  claimed_at: string | null
  created_at: string
}

export interface CheckItem {
  id: number
  qr_code_id: number | null
  campaign_id: number | null
  campaign_name: string
  code_input: string
  result: CheckResult
  user_name: string | null
  ip: string
  source: 'app' | 'web'
  created_at: string
}

export interface CodeDetail extends CodeListItem {
  claim_note: string
  claimed_by_name: string | null
  ip: string | null
  user_agent: string | null
  checks: CheckItem[]
}

export interface PrizeBreakdownItem {
  prize_id: number
  title: string
  type: PrizeType
  quantity: number
  revealed_count: number
  delivered_count: number
}

export interface StatsResponse {
  total: number
  checked: number
  unused: number
  disabled: number
  winners: number
  winners_revealed: number
  claimed: number
  pending_prizes: number
  prize_breakdown: PrizeBreakdownItem[]
  chart: { day: string; total: number; wins: number }[]
}

export interface QrSettings {
  android_package: string
  android_sha256: string
  ios_team_id: string
  ios_bundle_id: string
}

export interface DownloadLink {
  download_url: string
  filename: string
}

export type QrListParams = Record<string, string | number | undefined>
