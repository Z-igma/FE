import { useAuthStore } from '@/stores/authStore';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { accessToken } = useAuthStore();
  return accessToken ? <Outlet /> : <Navigate to="/home" replace />;
};

export default ProtectedRoute;
