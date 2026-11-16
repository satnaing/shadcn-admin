import { useQuery } from '@tanstack/react-query'
import { aiApi } from '@/api/modules/ai.api'
import { usePaginatedQuery } from '@/hooks/use-paginated-query'
import type { UsageListParams } from '../data/ai.type'

export const aiKeys = {
  all: ['AI'] as const,
  settings: () => [...aiKeys.all, 'settings'] as const,
  prompts: () => [...aiKeys.all, 'prompts'] as const,
  usage: (p: UsageListParams) => [...aiKeys.all, 'usage', p] as const,
  languages: () => [...aiKeys.all, 'languages'] as const,
}

export const useAiSettings = () => useQuery({ queryKey: aiKeys.settings(), queryFn: aiApi.settings })

export const useAiPrompts = () => useQuery({ queryKey: aiKeys.prompts(), queryFn: aiApi.prompts })

export const useAiUsage = (params: UsageListParams) =>
  usePaginatedQuery({ queryKey: aiKeys.usage(params), queryFn: () => aiApi.usage(params) })

export const useAiLanguages = () => useQuery({ queryKey: aiKeys.languages(), queryFn: aiApi.languages })
