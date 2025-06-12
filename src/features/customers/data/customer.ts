import { faker } from '@faker-js/faker'

export const customer = Array.from({ length: 20 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    refferal_code: faker.string.alphanumeric(8).toUpperCase(),
    
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})