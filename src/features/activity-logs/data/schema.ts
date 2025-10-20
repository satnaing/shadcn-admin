import { z } from 'zod'

// Activity Log action types
const activityActionSchema = z.union([
  z.literal('user.created'),
  z.literal('user.updated'),
  z.literal('user.deleted'),
  z.literal('user.login'),
  z.literal('user.logout'),
  z.literal('user.password_changed'),
  z.literal('task.created'),
  z.literal('task.updated'),
  z.literal('task.deleted'),
  z.literal('task.status_changed'),
  z.literal('settings.updated'),
  z.literal('settings.theme_changed'),
  z.literal('role.assigned'),
  z.literal('role.revoked'),
  z.literal('export.data'),
  z.literal('import.data'),
  z.literal('system.error'),
  z.literal('system.warning'),
])
export type ActivityAction = z.infer<typeof activityActionSchema>

// Activity Log severity levels
const activitySeveritySchema = z.union([
  z.literal('info'),
  z.literal('success'),
  z.literal('warning'),
  z.literal('error'),
])
export type ActivitySeverity = z.infer<typeof activitySeveritySchema>

// Activity Log resource types
const activityResourceSchema = z.union([
  z.literal('user'),
  z.literal('task'),
  z.literal('setting'),
  z.literal('role'),
  z.literal('system'),
  z.literal('data'),
])
export type ActivityResource = z.infer<typeof activityResourceSchema>

// Main Activity Log schema
export const activityLogSchema = z.object({
  id: z.string(),
  timestamp: z.coerce.date(),
  userId: z.string(),
  userName: z.string(),
  userAvatar: z.string().optional(),
  action: activityActionSchema,
  resource: activityResourceSchema,
  resourceId: z.string().optional(),
  description: z.string(),
  severity: activitySeveritySchema,
  metadata: z.record(z.any()).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
})

export type ActivityLog = z.infer<typeof activityLogSchema>

export const activityLogListSchema = z.array(activityLogSchema)

// Helper function to get action label
export function getActionLabel(action: ActivityAction): string {
  const labels: Record<ActivityAction, string> = {
    'user.created': 'User Created',
    'user.updated': 'User Updated',
    'user.deleted': 'User Deleted',
    'user.login': 'User Login',
    'user.logout': 'User Logout',
    'user.password_changed': 'Password Changed',
    'task.created': 'Task Created',
    'task.updated': 'Task Updated',
    'task.deleted': 'Task Deleted',
    'task.status_changed': 'Task Status Changed',
    'settings.updated': 'Settings Updated',
    'settings.theme_changed': 'Theme Changed',
    'role.assigned': 'Role Assigned',
    'role.revoked': 'Role Revoked',
    'export.data': 'Data Exported',
    'import.data': 'Data Imported',
    'system.error': 'System Error',
    'system.warning': 'System Warning',
  }
  return labels[action] || action
}

// Helper function to get severity color
export function getSeverityColor(severity: ActivitySeverity): string {
  const colors: Record<ActivitySeverity, string> = {
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
  }
  return colors[severity]
}

// Helper function to get severity badge variant
export function getSeverityBadgeVariant(
  severity: ActivitySeverity
): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants: Record<
    ActivitySeverity,
    'default' | 'secondary' | 'destructive' | 'outline'
  > = {
    info: 'secondary',
    success: 'default',
    warning: 'outline',
    error: 'destructive',
  }
  return variants[severity]
}
