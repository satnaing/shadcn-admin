export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  designation?: string | null;
  address?: string | null;
  roles: string[];
  managerId?: number | null;
  managerName?: string | null;
  teamName?: string | null;
  isActive: boolean;
  createdAt?: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  designation?: string;
  address?: string;
  roleIds: number[];
  managerId?: number | null;
  teamId?: string | null;
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  designation?: string;
  address?: string;
  roleIds: number[];
  managerId?: number | null;
  teamId?: string | null;
  isActive: boolean;
}

export interface UserFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  designation: string;
  address: string;
  roleIds: number[];
  managerId: string;
}