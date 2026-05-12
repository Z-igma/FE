import { useAuthStore } from '@/stores/authStore';
import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';

const ProtectedRoute = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const inviteCode = searchParams.get('inviteCode');
  const { accessToken } = useAuthStore();

  if (!accessToken) {
    if (inviteCode) {
      sessionStorage.setItem('inviteCode', inviteCode);
      sessionStorage.setItem('redirectPage', location.pathname);
      return <Navigate to="/login" replace />;
    }
  }

  return accessToken ? <Outlet /> : <Navigate to="/home" replace />;
};

export default ProtectedRoute;
