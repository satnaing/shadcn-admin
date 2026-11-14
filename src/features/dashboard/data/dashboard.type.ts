export type DashboardStatKey = 'pages' | 'blogs' | 'modules' | 'visits'

export interface DashboardStat {
  key: DashboardStatKey
  value: number
  /** Percent change vs. the previous 30 days. */
  delta: number
}

export interface DashboardVisitPoint {
  date: string
  visits: number
  pageviews: number
}

export interface DashboardActivity {
  id: number
  actor: string
  action: 'created' | 'updated' | 'published' | 'activated' | 'deleted'
  target: string
  at: string
}

export interface DashboardData {
  stats: DashboardStat[]
  visits: DashboardVisitPoint[]
  activity: DashboardActivity[]
}
