import { useNavigate } from 'react-router-dom';
import BackButtonIcon from '@/assets/images/backButtonIcon.svg';

interface HeaderProps {
  title: string;
  rightIcon?: React.ReactNode;
  onRightClick?: () => void;
}

const Header = ({ title, rightIcon, onRightClick }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-4 py-4.5">
      <img src={BackButtonIcon} alt="뒤로 가기" onClick={() => navigate(-1)} />
      <p className="text-[#111111] font-Pretendard font-semibold text-[1.25rem] leading-5">
        {title}
      </p>
      {rightIcon ? (
        <div onClick={onRightClick}>{rightIcon}</div>
      ) : (
        <div className="w-7" />
      )}
    </div>
  );
};

export default Header;
