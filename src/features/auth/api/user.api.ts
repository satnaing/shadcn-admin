import { axiosInstance } from '@/utils/axios.util'
import { IUser } from '../interface/user.interface'

export async function getUser() {
  const { data } = await axiosInstance({
    method: 'GET',
    url: `/user/me`,
  })
  return data as IUser
}

// ../api/user.api.ts
// import { IUser, UserSubscriptionStatus } from '../interface/user.interface'

// export async function getUser(): Promise<IUser> {
//   // Optional: simulate network delay
//   await new Promise((res) => setTimeout(res, 300))

//   return {
//     _id: 'user_123',
//     firstName: 'Satyam',
//     lastName: 'Yadav',
//     email: 'satyam@example.com',
//     phone: '+91-7840935392',
//     provider: 'google',
//     providerId: 'google-uid-123',
//     image: {
//       _id: 'img_001',
//       url: 'https://via.placeholder.com/150',
//     },
//     intent: 'testing-ui',
//     subscribedProductId: 'prod_001',
//     subscribedProductVariantId: 'variant_001',
//     subscribedProduct: {
//       _id: 'prod_001',
//       name: 'Premium Plan',
//       description: 'Unlimited access',
//       price: 999,
//       currency: 'INR',
//     } as any, // or import the actual IProduct definition
//     subscribedProductVariant: {
//       _id: 'variant_001',
//       name: 'Monthly',
//       price: 999,
//       duration: 30,
//     } as any,
//     status: UserSubscriptionStatus.ACTIVE,
//     subscription: {
//       _id: 'sub_123',
//       startDate: new Date().toISOString(),
//       endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
//       status: 'active',
//     } as any,
//   }
// }
