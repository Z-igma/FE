import LoginButton from './components/LoginButton';
import MainLogoIcon from '@assets/images/mainLogoIcon.svg';

const Login = () => {
  // 소셜 로그인 리다이렉트
  const handleLogin = (provider: 'kakao' | 'naver') => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/${provider}`;
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
        <LoginButton type="kakao" onClick={() => handleLogin('kakao')} />
        <LoginButton type="naver" onClick={() => handleLogin('naver')} />
      </div>
    </div>
  );
};

export default Login;
