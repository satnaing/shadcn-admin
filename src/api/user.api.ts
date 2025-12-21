import type { CreateUserRequest, UpdateUserRequest } from '@/contracts/Request';
import axiosClient from './axiosClient';
 
import type { IUserResponse } from '@/contracts/Response/IUser';

export const userAPI = {
  getUsers: async (): Promise<{ data: IUserResponse[] }> => {
    const response = await axiosClient.get<IUserResponse[]>('/users'); 
    return { data: response.data };
  },
  getUser: async (id: string) => {
    const response = await axiosClient.get(`/users/${id}`);
    return response.data;
  },
  createUser: async (data: CreateUserRequest) => {
    const response = await axiosClient.post('/users', data);
    return response.data;
  },
  updateUser: (id: string, data: UpdateUserRequest) => axiosClient.put(`/users/${id}`, data),
  resetPassword: (id: string, newPassword: string) => axiosClient.put(`/users/${id}/reset-password`, { newPassword }),
  resetMyPassword: () => axiosClient.post('/users/reset-my-password'),
  deleteUser: async (id: string) => {
    await axiosClient.delete(`/users/${id}`);
  }
};
