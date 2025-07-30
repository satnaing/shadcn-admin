import axios from 'axios';
import { UserAccess } from '@/context/auth-context';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

function getTokenFromCookie() {
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function fetchUserInfoFromApi(token?: string): Promise<UserAccess | null> {
  // If no token provided, try to get from cookie
  const authToken = token || getTokenFromCookie();
  if (!authToken) {
    console.warn('No auth token found for fetching user info.');
    return null;
  }
  try {
    const response = await axios.get(`${BACKEND_BASE_URL}/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const user = response.data;
    // Map backend fields to UserAccess
    const is_super_admin = !!user.is_super_admin || user.is_super_admin === 1;
    const allowedServices = is_super_admin
      ? ['users', 'customers', 'upi', 'bbps' , 'bureau', 'wealth-ifa','credit-repair'] // all service keys for superadmin
      : (user.services || user.allowedServices || []).map((s: { service_name?: string }) => {
          if (s.service_name === 'Users') return 'users';
          if (s.service_name === 'Customers') return 'customers';
          if (s.service_name === 'UPI') return 'upi';
          if (s.service_name === 'BBPS') return 'bbps';
          if (s.service_name === 'Bureau') return 'bureau';
          if (s.service_name === 'Wealth IFA') return 'wealth-ifa';
          if (s.service_name === 'Credit Repair') return 'credit-repair';
          // Add more mappings as needed
          return s.service_name?.toLowerCase().replace(/\s+/g, '-');
        });
    return {
      id: user.id,
      email: user.email, // Add email from API response
      name: user.name, // Try to get name from API response
      is_super_admin,
      allowedServices,
    };
  } catch (err) {
    console.error('Error fetching user info:', err);
    return null;
  }
}
