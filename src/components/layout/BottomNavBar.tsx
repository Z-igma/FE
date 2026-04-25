import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import ActiveHomeIcon from '@assets/images/activeHomeIcon.svg';
import InactiveHomeIcon from '@assets/images/inactiveHomeIcon.svg';
import ActiveMapIcon from '@assets/images/activeMapIcon.svg';
import InactiveMapIcon from '@assets/images/inactiveMapIcon.svg';
import ActiveScheduleIcon from '@assets/images/activeScheduleIcon.svg';
import InactiveScheduleIcon from '@assets/images/inactiveScheduleIcon.svg';
import ActiveAccountIcon from '@assets/images/activeAccountIcon.svg';
import InactiveAccountIcon from '@assets/images/inactiveAccountIcon.svg';

const tabs = [
  {
    path: '/home',
    label: '홈',
    defaultIcon: InactiveHomeIcon,
    activeIcon: ActiveHomeIcon,
  },
  {
    path: '/map',
    label: '지도',
    defaultIcon: InactiveMapIcon,
    activeIcon: ActiveMapIcon,
  },
  {
    path: '/schedule',
    label: '일정',
    defaultIcon: InactiveScheduleIcon,
    activeIcon: ActiveScheduleIcon,
  },
  {
    path: '/account',
    label: '내 정보',
    defaultIcon: InactiveAccountIcon,
    activeIcon: ActiveAccountIcon,
  },
];

const BottomNavBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLoggedIn } = useAuthStore();

  // 비로그인 시 기본 지도 및 홈 화면만 접근 가능
  const handleTabClick = (path: string) => {
    if (!isLoggedIn && path !== '/map' && path !== '/home') {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  return (
    <nav className="flex justify-between items-center fixed bottom-5 w-full max-w-[393px] px-9.5 py-3.75 bg-[#FFFFFF] shadow-[0_4px_20px_0_rgba(17,17,17,0.04)] rounded-t-[20px] left-1/2 -translate-x-1/2">
      {tabs.map(({ path, label, defaultIcon, activeIcon }) => (
        <button
          key={path}
          onClick={() => handleTabClick(path)}
          className="flex flex-col items-center gap-1.25 text-xs"
        >
          <img src={pathname === path ? activeIcon : defaultIcon} alt={label} />
          <span className="font-normal font-Pretendard leading-4 text-[#111111]">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavBar;
