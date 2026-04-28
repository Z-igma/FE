import { useAuthStore } from '@/stores/authStore';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? <Outlet /> : <Navigate to="/home" replace />;
};

export default ProtectedRoute;
