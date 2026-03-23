import { z } from 'zod'

export const ruleVersionSchema = z.object({
  rule_id: z.string(),
  proj_id: z.string(),
  rule_name: z.string(),
  rule_status: z.enum(['active', 'watch', 'close']),
  rule_desc: z.string(),
  create_time: z.string(),
  update_time: z.string(),
})

export type RuleVersion = z.infer<typeof ruleVersionSchema>
