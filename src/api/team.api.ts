import axiosClient from '@/api/axiosClient';

export const teamAPI = {
  getTeamHierarchy: async () => {
    const response = await axiosClient.get('/teams/hierarchy');
    return response.data;
  },

  getTeamById: async (id: string) => {
    const response = await axiosClient.get(`/teams/${id}`);
    return response.data;
  },

  createTeam: async (teamData: any) => {
    const response = await axiosClient.post('/teams', teamData);
    return response.data;
  },

  updateTeam: async (id: string, teamData: any) => {
    const response = await axiosClient.put(`/teams/${id}`, teamData);
    return response.data;
  },

  deleteTeam: async (id: string) => {
    await axiosClient.delete(`/teams/${id}`);
  },

  assignUserToTeam: async (userId: string, teamId: string) => {
    await axiosClient.post('/teams/assign-user', { userId, teamId });
  },

  setUserManager: async (userId: string, managerId: string) => {
    await axiosClient.post('/teams/set-manager', { userId, managerId });
  }
};