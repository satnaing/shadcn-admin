import { AuthContext } from '@/context/auth-context';
import { fetchUserInfoFromApi } from '@/utils/fetch-user-info';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

interface ProtectedRouteProps {
  requiredService: string;
  children: React.ReactNode;
}
const getToken = () => {
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};

export function ProtectedRoute({ requiredService, children }: ProtectedRouteProps) {
  console.log('[ProtectedRoute] Component rendered. requiredService:', requiredService);
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function ensureUserFetched() {
      if (!user) {
        setLoading(true);
        const token = getToken();
        console.log('[ProtectedRoute] No user in context, token:', token);
        if (token) {
          const userInfo = await fetchUserInfoFromApi(token);
          console.log('[ProtectedRoute] User info fetched from API:', userInfo);
          setUser(userInfo);
        } else {
          console.warn('[ProtectedRoute] No token found in cookies.');
        }
        setLoading(false);
      } else {
        console.log('[ProtectedRoute] User already in context:', user);
      }
    }
    ensureUserFetched();
    // eslint-disable-next-line
  }, []);

  const isUnauthorized =
    user &&
    (!user.allowedServices ||
      !user.allowedServices.map((s: string) => s.toLowerCase()).includes(requiredService.toLowerCase()));

  useEffect(() => {
    if (isUnauthorized) {
      window.alert('YOU ARE NOT AUTHORIZED');
      navigate({ to: '/' });
    }
  }, [isUnauthorized, navigate]);

  if (loading || !user) {
    console.log('[ProtectedRoute] Loading or no user. Loading:', loading, 'User:', user);
    return null;
  }
  console.log('[ProtectedRoute] Debug allowedServices:', user.allowedServices, 'requiredService:', requiredService);
  if (isUnauthorized) {
    console.warn('[ProtectedRoute] User does not have access to this service:', requiredService, 'Allowed:', user.allowedServices);
    return null;
  }

  console.log('[ProtectedRoute] User authorized for service:', requiredService);
  return <>{children}</>;
}
