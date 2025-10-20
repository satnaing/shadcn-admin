import { faker } from '@faker-js/faker'
import type { ActivityAction, ActivityLog } from './schema'

// Sample user names and IDs for consistency
const sampleUsers = Array.from({ length: 15 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  avatar: faker.image.avatar(),
}))

// Activity actions with their corresponding resources and severities
const activityTemplates: Array<{
  action: ActivityAction
  resource: ActivityLog['resource']
  severity: ActivityLog['severity']
  descriptionTemplate: (userName: string) => string
}> = [
  {
    action: 'user.created',
    resource: 'user',
    severity: 'success',
    descriptionTemplate: (userName) =>
      `${userName} created a new user account`,
  },
  {
    action: 'user.updated',
    resource: 'user',
    severity: 'info',
    descriptionTemplate: (userName) => `${userName} updated user profile`,
  },
  {
    action: 'user.deleted',
    resource: 'user',
    severity: 'warning',
    descriptionTemplate: (userName) => `${userName} deleted a user account`,
  },
  {
    action: 'user.login',
    resource: 'user',
    severity: 'success',
    descriptionTemplate: (userName) => `${userName} logged in to the system`,
  },
  {
    action: 'user.logout',
    resource: 'user',
    severity: 'info',
    descriptionTemplate: (userName) => `${userName} logged out from the system`,
  },
  {
    action: 'user.password_changed',
    resource: 'user',
    severity: 'success',
    descriptionTemplate: (userName) => `${userName} changed their password`,
  },
  {
    action: 'task.created',
    resource: 'task',
    severity: 'success',
    descriptionTemplate: (userName) => `${userName} created a new task`,
  },
  {
    action: 'task.updated',
    resource: 'task',
    severity: 'info',
    descriptionTemplate: (userName) => `${userName} updated a task`,
  },
  {
    action: 'task.deleted',
    resource: 'task',
    severity: 'warning',
    descriptionTemplate: (userName) => `${userName} deleted a task`,
  },
  {
    action: 'task.status_changed',
    resource: 'task',
    severity: 'info',
    descriptionTemplate: (userName) => `${userName} changed task status`,
  },
  {
    action: 'settings.updated',
    resource: 'setting',
    severity: 'info',
    descriptionTemplate: (userName) => `${userName} updated system settings`,
  },
  {
    action: 'settings.theme_changed',
    resource: 'setting',
    severity: 'info',
    descriptionTemplate: (userName) => `${userName} changed theme preferences`,
  },
  {
    action: 'role.assigned',
    resource: 'role',
    severity: 'success',
    descriptionTemplate: (userName) => `${userName} assigned a role to a user`,
  },
  {
    action: 'role.revoked',
    resource: 'role',
    severity: 'warning',
    descriptionTemplate: (userName) => `${userName} revoked a user role`,
  },
  {
    action: 'export.data',
    resource: 'data',
    severity: 'info',
    descriptionTemplate: (userName) => `${userName} exported data to CSV`,
  },
  {
    action: 'import.data',
    resource: 'data',
    severity: 'info',
    descriptionTemplate: (userName) => `${userName} imported data from file`,
  },
  {
    action: 'system.error',
    resource: 'system',
    severity: 'error',
    descriptionTemplate: () =>
      'System encountered an error during operation',
  },
  {
    action: 'system.warning',
    resource: 'system',
    severity: 'warning',
    descriptionTemplate: () => 'System generated a warning alert',
  },
]

// Generate activity logs
export const activityLogs: ActivityLog[] = Array.from(
  { length: 150 },
  () => {
    const user = faker.helpers.arrayElement(sampleUsers)
    const template = faker.helpers.arrayElement(activityTemplates)

    // Generate dates in the past (last 30 days)
    const timestamp = faker.date.recent({ days: 30 })

    return {
      id: faker.string.uuid(),
      timestamp,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      action: template.action,
      resource: template.resource,
      resourceId: faker.string.uuid(),
      description: template.descriptionTemplate(user.name),
      severity: template.severity,
      ipAddress: faker.internet.ip(),
      userAgent: faker.internet.userAgent(),
      metadata: {
        browser: faker.helpers.arrayElement([
          'Chrome',
          'Firefox',
          'Safari',
          'Edge',
        ]),
        device: faker.helpers.arrayElement(['Desktop', 'Mobile', 'Tablet']),
        location: faker.location.city(),
      },
    }
  }
).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()) // Sort by most recent first
