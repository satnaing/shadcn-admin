import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/auth-context';
import { fetchUserInfoFromApi } from '@/utils/fetch-user-info';

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
    
    try{
       ensureUserFetched(); 
    }catch(r){
        console.log(r);
    }

  },);

  async function ensureUserFetched() {
        debugger;
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

  useEffect(() => {
    console.log('[ProtectedRoute] Checking access for service:', requiredService, 'User:', user);
    if (user && user.allowedServices && !user.allowedServices.includes(requiredService)) {
      setTimeout(() => {
        window.alert('YOU ARE NOT AUTHORIZED');
        navigate('/dashboard');
      }, 0);
    }
  }, [user, requiredService, navigate]);

  if (loading || !user) {
    console.log('[ProtectedRoute] Loading or no user. Loading:', loading, 'User:', user);
    return null;
  }
  if (!user.allowedServices || !user.allowedServices.includes(requiredService)) {
    console.warn('[ProtectedRoute] User does not have access to this service:', requiredService);
    return null;
  }

  console.log('[ProtectedRoute] User authorized for service:', requiredService);
  return <>{children}</>;
}
