import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      // 토큰 없으면 로그인 페이지로
      navigate('/login', { replace: true });
      return;
    }

    login(accessToken);
    navigate('/home', { replace: true });
  }, []);

  return null;
};

export default OAuthCallback;
