import KakaoIcon from '@assets/images/kakaoIcon.svg';
import NaverIcon from '@assets/images/naverIcon.svg';

const LoginButton = ({
  type,
  onClick,
}: {
  type: 'kakao' | 'naver';
  onClick?: () => void;
}) => {
  const isKakao = type === 'kakao';

  return (
    <button
      onClick={onClick}
      className={`w-75 h-11 flex items-center justify-center gap-2 rounded-md ${isKakao ? 'bg-[#FEE500]' : 'bg-[#03C75A]'}`}
    >
      <img src={isKakao ? KakaoIcon : NaverIcon} alt={type} />
      <p
        className={`font-Pretendard font-semibold leading-6 ${isKakao ? 'text-[#111111]' : 'text-[#FFFFFF]'}`}
      >
        {isKakao ? '카카오 로그인' : '네이버 로그인'}
      </p>
    </button>
  );
};

export default LoginButton;
