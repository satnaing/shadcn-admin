import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { Team, TeamRole } from '@/features/teams/types'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const CURRENT_TEAM = 'current_team'

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
  team: {
    currentTeam: Team | null
    setCurrentTeam: (team: Team | null) => void
    currentRole: TeamRole
    setCurrentRole: (role: TeamRole) => void
    teams: Team[]
    setTeams: (teams: Team[]) => void
    addTeam: (team: Team) => void
    updateTeam: (team: Team) => void
    removeTeam: (teamId: string) => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  const currentTeamCookie = getCookie(CURRENT_TEAM)
  const initCurrentTeam = currentTeamCookie ? JSON.parse(currentTeamCookie) : null

  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(CURRENT_TEAM)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
            team: { ...state.team, currentTeam: null },
          }
        }),
    },
    team: {
      currentTeam: initCurrentTeam,
      setCurrentTeam: (team) =>
        set((state) => {
          if (team) {
            setCookie(CURRENT_TEAM, JSON.stringify(team))
          } else {
            removeCookie(CURRENT_TEAM)
          }
          return { ...state, team: { ...state.team, currentTeam: team } }
        }),
      currentRole: 'admin', // Default role, should be set from API
      setCurrentRole: (role) =>
        set((state) => ({ ...state, team: { ...state.team, currentRole: role } })),
      teams: [],
      setTeams: (teams) =>
        set((state) => ({ ...state, team: { ...state.team, teams } })),
      addTeam: (team) =>
        set((state) => ({ ...state, team: { ...state.team, teams: [...state.team.teams, team] } })),
      updateTeam: (team) =>
        set((state) => ({
          ...state,
          team: {
            ...state.team,
            teams: state.team.teams.map((t) => (t.id === team.id ? team : t)),
            currentTeam: state.team.currentTeam?.id === team.id ? team : state.team.currentTeam,
          },
        })),
      removeTeam: (teamId) =>
        set((state) => ({
          ...state,
          team: {
            ...state.team,
            teams: state.team.teams.filter((t) => t.id !== teamId),
            currentTeam: state.team.currentTeam?.id === teamId ? null : state.team.currentTeam,
          },
        })),
    },
  }
})
