import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Team } from '@/features/teams/data/teams'

interface TeamState {
  teams: Team[]
  activeTeam: Team | null
  setTeams: (teams: Team[]) => void
  addTeam: (team: Team) => void
  updateTeam: (team: Team) => void
  archiveTeam: (teamId: string) => void
  setActiveTeam: (team: Team) => void
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      teams: [],
      activeTeam: null,
      setTeams: (teams) => set(() => ({ teams })),
      addTeam: (team) =>
        set((state) => ({
          teams: [...state.teams, team],
          activeTeam: team,
        })),
      updateTeam: (team) =>
        set((state) => ({
          teams: state.teams.map((t) => (t.id === team.id ? team : t)),
          activeTeam: team.id === state.activeTeam?.id ? team : state.activeTeam,
        })),
      archiveTeam: (teamId) =>
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, isArchived: true } : t
          ),
          activeTeam: state.activeTeam?.id === teamId ? null : state.activeTeam,
        })),
      setActiveTeam: (team) => set(() => ({ activeTeam: team })),
    }),
    {
      name: 'team-storage',
    }
  )
)
