import axiosClient from '@/api/axiosClient';

export const emailAPI = {
  getInbox: async (params = {}) => {
    const response = await axiosClient.get('/email/inbox', { params });
    return response.data;
  },

  getSent: async (params = {}) => {
    const response = await axiosClient.get('/email/sent', { params });
    return response.data;
  },

  getEmail: async (id: string) => {
    const response = await axiosClient.get(`/email/${id}`);
    return response.data;
  },

  sendEmail: async (emailData: any) => {
    const response = await axiosClient.post('/email/send', emailData);
    return response.data;
  },

  toggleStar: async (id: string) => {
    const response = await axiosClient.put(`/email/${id}/star`);
    return response.data;
  },

  toggleImportant: async (id: string) => {
    const response = await axiosClient.put(`/email/${id}/important`);
    return response.data;
  },

  deleteEmail: async (id: string) => {
    await axiosClient.delete(`/email/${id}`);
  },

  getSignature: async () => {
    const response = await axiosClient.get('/email/signature');
    return response.data;
  },

  syncInbox: async () => {
    const response = await axiosClient.post('/email/sync');
    return response.data;
  }
};