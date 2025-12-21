import axiosClient from '@/api/axiosClient';

export const authAPI = {
  login: (email: string, password: string) => axiosClient.post('/auth/login', { email, password }),
  logout: () => axiosClient.post('/auth/logout'),
  createTenant: (data: any) => axiosClient.post('/auth/tenant', data),
  getSubscriptionPlans: () => axiosClient.get('/subscriptions/plans')
};
