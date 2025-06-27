import { jwtDecode } from 'jwt-decode';
import { UserAccess } from '@/context/auth-context';

export function getUserFromToken(token: string): UserAccess {
  const decoded: any = jwtDecode(token);
  console.log('debug');
  console.log('Decoded JWT:', decoded);

  // Map backend fields to frontend UserAccess
  const is_super_admin = !!decoded.is_super_admin || decoded.is_super_admin === 1;
  // If not superadmin, extract allowed service keys
  const allowedServices = is_super_admin
    ? []
    : (decoded.services || []).map((s: any) => {
        if (s.service_name === 'User Management') return 'users';
        if (s.service_name === 'Inventory Management') return 'inventory';
        // Add more mappings as needed
        return s.service_name.toLowerCase().replace(/\s+/g, '-');
      });

  return {
    id: decoded.id,
    email: decoded.email || '', // Add email from decoded JWT, fallback to empty string
    is_super_admin,
    allowedServices,
  };
}
