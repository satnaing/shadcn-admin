import axiosClient from './axiosClient';

export const roleAPI = {
  getTenantModules: async () => {
    const response = await axiosClient.get('/modules/tenant');
    return response.data;
  },
  getRoles: async () => {
    const response = await axiosClient.get('/roles');
    return response.data;
  },
  getRoleById: async (roleId: string) => {
    const response = await axiosClient.get(`/roles/${roleId}`);
    return response.data;
  },
  createRole: async (roleData: any) => {
    const response = await axiosClient.post('/roles', roleData);
    return response.data;
  },
  updateRole: async (roleId: string, roleData: any) => {
    const response = await axiosClient.put(`/roles/${roleId}`, roleData);
    return response.data;
  },
  deleteRole: async (roleId: string) => {
    await axiosClient.delete(`/roles/${roleId}`);
  },
  updateRolePermissions: async (roleId: string, permissionIds: string[]) => {
    await axiosClient.put(`/roles/${roleId}/permissions`, { permissionIds });
  },
  getPermissions: async () => {
    const response = await axiosClient.get('/permissions');
    return response.data;
  },
  getTenantScreens: async () => {
    const response = await axiosClient.get('/modules/tenant-screens');
    return response.data;
  },
  getAvailableScreens: async () => {
    const response = await axiosClient.get('/modules/tenant-screens');
    return response.data;
  }
};
