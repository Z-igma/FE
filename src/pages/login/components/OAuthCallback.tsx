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

    // 초대 링크로 왔었으면
    const inviteCode = sessionStorage.getItem('inviteCode');
    const redirectPage = sessionStorage.getItem('redirectPage');

    if (inviteCode && redirectPage) {
      navigate(`${redirectPage}?inviteCode=${inviteCode}`, { replace: true });
      return;
    }
    navigate('/home', { replace: true });
  }, []);

  return null;
};

export default OAuthCallback;
