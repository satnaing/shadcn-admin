import { faker } from '@faker-js/faker'
import { type Agent } from './schema'

// Generate mock agents data
export const mockAgents: Agent[] = Array.from({ length: 10 }, (_, i) => ({
  id: faker.string.uuid(),
  name: `Agent ${faker.commerce.productName()} ${i + 1}`,
  description: faker.lorem.sentence(),
  prompt: faker.lorem.paragraphs(2),
  model: faker.helpers.arrayElement(['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus', 'claude-3-sonnet']),
  mode: faker.helpers.arrayElement(['chat', 'task']),
  isActive: faker.datatype.boolean(0.8),
  createdAt: faker.date.past(1),
  updatedAt: faker.date.recent(30),
  usageStats: {
    totalCalls: faker.number.int({ min: 0, max: 1000 }),
    successfulCalls: faker.number.int({ min: 0, max: 1000 }),
    failedCalls: faker.number.int({ min: 0, max: 100 }),
    averageResponseTime: faker.number.int({ min: 100, max: 5000 }),
    lastCalledAt: faker.date.recent(7),
  },
}))

// Get agents with optional filter for active status
export function getAgents(activeOnly = false): Agent[] {
  if (activeOnly) {
    return mockAgents.filter(agent => agent.isActive)
  }
  return mockAgents
}

// Get a single agent by ID
export function getAgentById(id: string): Agent | undefined {
  return mockAgents.find(agent => agent.id === id)
}

// Create a new agent
export function createAgent(agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'usageStats'>): Agent {
  const newAgent: Agent = {
    ...agentData,
    id: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    usageStats: {
      totalCalls: 0,
      successfulCalls: 0,
      failedCalls: 0,
      averageResponseTime: 0,
    },
  }
  
  mockAgents.push(newAgent)
  return newAgent
}

// Update an existing agent
export function updateAgent(id: string, agentData: Partial<Agent>): Agent | undefined {
  const agentIndex = mockAgents.findIndex(agent => agent.id === id)
  
  if (agentIndex === -1) {
    return undefined
  }
  
  const updatedAgent: Agent = {
    ...mockAgents[agentIndex],
    ...agentData,
    updatedAt: new Date(),
  }
  
  mockAgents[agentIndex] = updatedAgent
  return updatedAgent
}

// Delete an agent
export function deleteAgent(id: string): boolean {
  const initialLength = mockAgents.length
  mockAgents = mockAgents.filter(agent => agent.id !== id)
  return mockAgents.length < initialLength
}