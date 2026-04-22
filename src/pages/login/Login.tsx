import MainLogoIcon from '@assets/images/mainLogoIcon.svg';
import LoginButton from './components/LoginButton';

const Login = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col items-center text-center gap-3">
        <img src={MainLogoIcon} className="w-17 h-17" />
        <p className="font-[KBLJump-EB-Extended] text-[#00408E] text-[1.25rem] leading-7 tracking-[0.1rem]">
          ZIGMA
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <LoginButton type="kakao" />
        <LoginButton type="naver" />
      </div>
    </div>
  );
};

export default Login;
