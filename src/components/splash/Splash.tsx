import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLogoIcon from '@assets/images/mainLogoIcon.svg';

const Splash = () => {
  const navigate = useNavigate();
  const [fadeState, setFadeState] = useState<'fadeIn' | 'fadeOut'>('fadeIn');

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFadeState('fadeOut');
    }, 1200);

    const navigateTimer = setTimeout(() => {
      navigate('/home');
    }, 1400);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-[#00408E] gap-4 transition-opacity duration-200 ${
        fadeState === 'fadeIn' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <img src={MainLogoIcon} alt="로고" />
      <p className="font-[KBLJump-EB-Extended] text-[#FFFFFF] text-[1.875rem] leading-10.5 tracking-[2.4px]">
        ZIGMA
      </p>
    </div>
  );
};

export default Splash;
