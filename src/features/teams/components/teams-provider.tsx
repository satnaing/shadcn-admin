import { createContext, useContext, ReactNode } from 'react'
import { useTeamStore } from '@/stores/team-store'
import { Team } from '../data/teams'

interface TeamsContextType {
  teams: Team[]
  activeTeam: Team | null
  setTeams: (teams: Team[]) => void
  addTeam: (team: Team) => void
  updateTeam: (team: Team) => void
  archiveTeam: (teamId: string) => void
  setActiveTeam: (team: Team) => void
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined)

export function TeamsProvider({ children }: { children: ReactNode }) {
  const { teams, activeTeam, setTeams, addTeam, updateTeam, archiveTeam, setActiveTeam } = useTeamStore()

  return (
    <TeamsContext.Provider value={{ teams, activeTeam, setTeams, addTeam, updateTeam, archiveTeam, setActiveTeam }}>
      {children}
    </TeamsContext.Provider>
  )
}

export function useTeams() {
  const context = useContext(TeamsContext)
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider')
  }
  return context
}
