export interface IUserResponse {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  designation: string | null;
  address: string | null;
  isActive: boolean;
  roles: string[];
  managerId: number | null;
  managerName: string | null;
  teamId: number | null;
  teamName: string | null;
  createdAt: string;
} 