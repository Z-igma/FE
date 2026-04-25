import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import LoginButton from './components/LoginButton';
import MainLogoIcon from '@assets/images/mainLogoIcon.svg';

const Login = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  // 로그인 완료 시 홈 화면으로
  const handleLogin = () => {
    login();
    navigate('/home', { replace: true });
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center text-center gap-3">
        <img src={MainLogoIcon} className="w-17 h-17" />
        <p className="font-[KBLJump-EB-Extended] text-[#00408E] text-[1.25rem] leading-7 tracking-[0.1rem]">
          ZIGMA
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <LoginButton type="kakao" onClick={handleLogin} />
        <LoginButton type="naver" onClick={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
