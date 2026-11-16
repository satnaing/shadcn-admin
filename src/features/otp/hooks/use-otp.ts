import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { otpApi } from '@/api/modules/otp.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { OtpListParams } from '../data/otp.type'

export const otpKeys = {
  all: ['OTP'] as const,
  settings: () => [...otpKeys.all, 'settings'] as const,
  gateways: () => [...otpKeys.all, 'gateways'] as const,
  templates: (p?: OtpListParams) => [...otpKeys.all, 'templates', p] as const,
  recipients: (q: string) => [...otpKeys.all, 'recipients', q] as const,
}

export const useOtpSettings = () => useQuery({ queryKey: otpKeys.settings(), queryFn: otpApi.settings })

export const useOtpGateways = () => useQuery({ queryKey: otpKeys.gateways(), queryFn: otpApi.gateways })

export const useOtpTemplates = (params: OtpListParams) =>
  usePaginatedQuery({ queryKey: otpKeys.templates(params), queryFn: () => otpApi.templates(params) })

/** AEC loaded every user into one `<select>`; here the picker searches on the server (2 characters minimum). */
export const useOtpRecipients = (q: string) =>
  useQuery({
    queryKey: otpKeys.recipients(q),
    queryFn: () => otpApi.recipients(q),
    enabled: q.trim().length >= 2,
    placeholderData: keepPreviousData,
  })
