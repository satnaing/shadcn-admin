import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { type Agent } from '../data/schema'
import { getAgents, getAgentById, createAgent, updateAgent, deleteAgent } from '../data/data'

interface AgentsContextType {
  agents: Agent[]
  loading: boolean
  error: string | null
  fetchAgents: (activeOnly?: boolean) => void
  fetchAgentById: (id: string) => Agent | undefined
  addAgent: (agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'usageStats'>) => Agent
  editAgent: (id: string, agentData: Partial<Agent>) => Agent | undefined
  removeAgent: (id: string) => boolean
}

const AgentsContext = createContext<AgentsContextType | undefined>(undefined)

export function AgentsProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAgents = useCallback((activeOnly = false) => {
    setLoading(true)
    setError(null)
    try {
      const data = getAgents(activeOnly)
      setAgents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agents')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAgentById = useCallback((id: string) => {
    try {
      return getAgentById(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch agent')
      return undefined
    }
  }, [])

  const addAgent = useCallback((agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'usageStats'>) => {
    try {
      const newAgent = createAgent(agentData)
      setAgents(prev => [...prev, newAgent])
      return newAgent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent')
      throw err
    }
  }, [])

  const editAgent = useCallback((id: string, agentData: Partial<Agent>) => {
    try {
      const updatedAgent = updateAgent(id, agentData)
      if (updatedAgent) {
        setAgents(prev => prev.map(agent => agent.id === id ? updatedAgent : agent))
      }
      return updatedAgent
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update agent')
      return undefined
    }
  }, [])

  const removeAgent = useCallback((id: string) => {
    try {
      const success = deleteAgent(id)
      if (success) {
        setAgents(prev => prev.filter(agent => agent.id !== id))
      }
      return success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete agent')
      return false
    }
  }, [])

  React.useEffect(() => {
    fetchAgents()
  }, [fetchAgents])

  const value = {
    agents,
    loading,
    error,
    fetchAgents,
    fetchAgentById,
    addAgent,
    editAgent,
    removeAgent,
  }

  return <AgentsContext.Provider value={value}>{children}</AgentsContext.Provider>
}

export function useAgents() {
  const context = useContext(AgentsContext)
  if (context === undefined) {
    throw new Error('useAgents must be used within an AgentsProvider')
  }
  return context
}