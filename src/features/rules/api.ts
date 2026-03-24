import apiClient from '@/lib/api-client'

export interface Proj {
  proj_id: string
  proj_name: string
  [key: string]: unknown
}

export interface Rule {
  rule_id: string
  proj_id: string
  rule_name: string
  rule_status: 'active' | 'watch' | 'close'
  rule_desc: string
  create_time: string
  update_time: string
}

interface ProjListResponse {
  status: number
  message: string
  data: Proj[]
}

interface RuleListResponse {
  status: number
  message: string
  data: {
    metadata: Rule[]
    pagination: {
      current: number
      pageSize: number
      total: number
    }
  }
}

export async function fetchProjs(userId: string): Promise<Proj[]> {
  const { data } = await apiClient.get<ProjListResponse>('/geerule/proj', {
    params: { user_id: userId },
  })
  return data.data
}

export async function fetchRules(userId: string, projId: string): Promise<Rule[]> {
  const { data } = await apiClient.get<RuleListResponse>('/geerule/rule', {
    params: { user_id: userId, proj_id: projId, current: 1, page_size: 100 },
  })
  return data.data.metadata
}

export async function fetchRuleDetail(userId: string, projId: string, ruleId: string): Promise<Rule & { rule_graph: unknown }> {
  const { data } = await apiClient.get<{ status: number; data: { metadata: (Rule & { rule_graph: unknown })[] } }>(
    '/geerule/rule',
    { params: { user_id: userId, proj_id: projId, rule_id: ruleId } }
  )
  return data.data.metadata[0]
}

export async function createRule(
  userId: string,
  projId: string,
  fields: { rule_name: string; rule_desc: string; rule_graph: string }
): Promise<void> {
  await apiClient.post('/geerule/rule', {
    user_id: userId,
    proj_id: projId,
    rule_name: fields.rule_name,
    rule_desc: fields.rule_desc,
    rule_graph: fields.rule_graph,
  })
}

export async function updateRule(
  userId: string,
  projId: string,
  ruleId: string,
  fields: { rule_name?: string; rule_desc?: string; rule_graph?: string }
): Promise<void> {
  await apiClient.put('/geerule/rule', fields, {
    params: { user_id: userId, proj_id: projId, rule_id: ruleId },
  })
}

export async function updateRuleStatus(
  userId: string,
  projId: string,
  ruleId: string,
  ruleStatus: string
): Promise<void> {
  await apiClient.put('/geerule/rule', { rule_status: ruleStatus }, {
    params: { user_id: userId, proj_id: projId, rule_id: ruleId },
  })
}

export async function deleteRule(userId: string, ruleId: string): Promise<void> {
  await apiClient.delete('/geerule/rule', {
    params: { user_id: userId, rule_id: ruleId },
  })
}

export async function runRule(
  params: { user_id: string; user_key: string; proj_id: string },
  data: unknown
): Promise<unknown> {
  const { data: response } = await apiClient.post('/geerule/run', data, { params })
  return response
}
