import { type CampaignContactStatusReason } from '@/graphql/global/types.generated'
import {
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  StopCircle,
  Loader2,
  Hourglass,
  PauseCircle,
} from 'lucide-react'

export const statuses = [
  {
    value: 'AWAITING_APPROVAL',
    label: 'Awaiting Approval',
    icon: PauseCircle,
    color: 'text-orange-600',
  },
  {
    value: 'PENDING',
    label: 'Queued',
    icon: Hourglass,
    color: 'text-blue-600',
  },
  {
    value: 'CONNECTION_SENT',
    label: 'Connection Sent',
    icon: Clock,
    color: 'text-blue-600',
  },
  {
    value: 'RUNNING',
    label: 'Running',
    icon: Clock,
    color: 'text-blue-600',
  },
  {
    value: 'CONNECTED',
    label: 'Connected',
    icon: CheckCircle2,
    color: 'text-green-600',
  },
  {
    value: 'MESSAGED',
    label: 'Messaged',
    icon: Loader2,
    color: 'text-blue-600',
  },
  {
    value: 'REPLIED',
    label: 'Replied',
    icon: CheckCircle2,
    color: 'text-green-600',
  },
  {
    value: 'FINISHED',
    label: 'Finished',
    icon: CheckCircle2,
    color: 'text-green-600',
  },
  {
    value: 'STOPPED',
    label: 'Stopped',
    icon: StopCircle,
    color: 'text-yellow-500',
  },
  {
    value: 'ERROR',
    label: 'Failed',
    icon: XCircle,
    color: 'text-red-600',
  },
  {
    value: 'ALL',
    label: 'All',
    icon: Circle,
    color: 'text-muted-foreground',
  },
]

export const statusReasonLabels: Record<CampaignContactStatusReason, string> = {
  // Error reasons
  ERROR_CANT_INVITE: "Can't Invite",
  ERROR_INVALID_LINKEDIN_URL: 'Invalid LinkedIn URL',
  ERROR_MISSING_DATA: 'Missing Data',
  ERROR_RECENTLY_INVITED: 'Recently Invited',
  // Finished reasons
  FINISHED_ALREADY_CONNECTED: 'Already Connected',
  FINISHED_CONNECTION_EXPIRED: 'Connection Expired',
  FINISHED_CONNECTION_REJECTED: 'Connection Rejected',
  FINISHED_TAKEN_MANUALLY: 'Taken Manually',
  // Stopped reasons
  STOPPED_ALREADY_CONTACTED: 'Already Contacted',
  STOPPED_AWAITING_APPROVAL: 'Awaiting Approval',
  STOPPED_CAMPAIGN_DELETED: 'Campaign Deleted',
  STOPPED_COLLEAGUE_REPLIED: 'Colleague Replied',
  STOPPED_EXCLUDED: 'Excluded',
  STOPPED_MANUAL_STOP: 'Manual Stop',
  STOPPED_SENDER_REMOVED: 'Sender Removed',
}
