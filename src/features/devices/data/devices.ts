import { faker } from '@faker-js/faker'

// Device statuses based on your schema
const deviceStatuses = [
  'in_use',
  'in_store',
  'allocated',
  'assigned',
  'disposed',
  'fault',
] as const

// Device types based on your schema (all lowercase, exact match!)
const deviceTypes = [
  'laptop',
  'printer',
  'server',
  'mobile',
  'desktop',
  'tablet',
  'network_device',
] as const

export const devices = Array.from({ length: 20 }, () => {
  return {
    id: faker.string.uuid(),
    device_name: faker.commerce.productName(),
    serial_number: faker.string.alphanumeric({ length: 12, casing: 'upper' }),
    brand: faker.helpers.arrayElement([
      'Dell', 'HP', 'Lenovo', 'Apple', 'Asus', 'Acer', 'Samsung', 'Microsoft'
    ]),
    model: faker.commerce.product(),
    processor: faker.number.int({ min: 2, max: 16 }), // Cores
    RAM: faker.helpers.arrayElement([4, 8, 16, 32, 64]), // GB
    storage: faker.helpers.arrayElement([128, 256, 512, 1024, 2048]), // GB
    mac_address: faker.internet.mac(),
    year_of_purchase: faker.number.int({ min: 2015, max: 2025 }),
    status: faker.helpers.arrayElement(deviceStatuses),
    device_type: faker.helpers.arrayElement(deviceTypes), // <- ADDED, exact match
    createdAt: faker.date.past({ years: 5 }),
    updatedAt: faker.date.recent({ days: 30 }),
  }
})
