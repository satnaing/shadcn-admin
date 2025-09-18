import { type GetCampaignContactsQuery } from '../graphql/operations.generated'

export type CampaignContactTableRow = GetCampaignContactsQuery['campaignContacts']['data'][number]
