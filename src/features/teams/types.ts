export type TeamVisibility = 'public' | 'private' | 'invite-only'

export type TeamRole = 'admin' | 'editor' | 'viewer' | 'visitor'

export type MemberStatus = 'online' | 'away' | 'busy' | 'offline'

export interface Team {
  id: string
  name: string
  description: string
  coverImage: string
  visibility: TeamVisibility
  createdAt: Date
  updatedAt: Date
  isArchived: boolean
  members: number
}

export interface TeamMember {
  id: string
  userId: string
  teamId: string
  role: TeamRole
  status: MemberStatus
  joinedAt: Date
  lastActiveAt: Date
}

export interface Invitation {
  id: string
  teamId: string
  email: string
  role: TeamRole
  token: string
  expiresAt: Date
  createdAt: Date
  acceptedAt: Date | null
}
