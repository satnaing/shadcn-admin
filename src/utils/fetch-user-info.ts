import axios from 'axios';
import { UserAccess } from '@/context/auth-context';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

export async function fetchUserInfoFromApi(token: string): Promise<UserAccess | null> {

  console.log('Fetching user info from API with token:', token);
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response.data;
    // Map backend fields to UserAccess
    const is_super_admin = !!user.is_super_admin || user.is_super_admin === 1;
    const allowedServices = is_super_admin
      ? ['users', 'customers', 'upi', 'bbps'] // all service keys for superadmin
      : (user.services || user.allowedServices || []).map((s: { service_name?: string }) => {
          if (s.service_name === 'Users') return 'users';
          if (s.service_name === 'Customers') return 'customers';
          if (s.service_name === 'UPI') return 'upi';
          if (s.service_name === 'BBPS') return 'bbps';
          // Add more mappings as needed
          return s.service_name?.toLowerCase().replace(/\s+/g, '-');
        });
    return {
      id: user.id,
      is_super_admin,
      allowedServices,
    };
  } catch (_) {
    return null;
  }
}
