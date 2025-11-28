import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export type Team = {
  id: string
  name: string
  description: string
  coverImage: string
  visibility: 'public' | 'private'
  createdAt: Date
  updatedAt: Date
  membersCount: number
  isArchived: boolean
}

export const teams: Team[] = Array.from({ length: 20 }, () => {
  const visibilityOptions: ('public' | 'private')[] = ['public', 'private']

  return {
    id: `TEAM-${faker.number.int({ min: 1000, max: 9999 })}`,
    name: faker.company.name(),
    description: faker.lorem.sentence({ min: 10, max: 30 }),
    coverImage: faker.image.url({ width: 800, height: 200 }),
    visibility: faker.helpers.arrayElement(visibilityOptions),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
    membersCount: faker.number.int({ min: 1, max: 50 }),
    isArchived: faker.datatype.boolean({ probability: 0.1 }),
  }
})
