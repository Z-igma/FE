import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import ActiveHomeIcon from '@assets/images/activeHomeIcon.svg';
import InactiveHomeIcon from '@assets/images/inactiveHomeIcon.svg';
import ActiveMapIcon from '@assets/images/activeMapIcon.svg';
import InactiveMapIcon from '@assets/images/inactiveMapIcon.svg';
import ActivePromiseIcon from '@assets/images/activePromiseIcon.svg';
import InactivePromiseIcon from '@assets/images/inactivePromiseIcon.svg';
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
    path: '/promise',
    label: '일정',
    defaultIcon: InactivePromiseIcon,
    activeIcon: ActivePromiseIcon,
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

  // 비로그인 시 지도 및 홈만 접근 가능
  const handleTabClick = (path: string) => {
    if (activeTab === path) return;
    if (!isLoggedIn && path !== '/map' && path !== '/home') {
      navigate('/login');
      return;
    }
    navigate(path);
  };

  const getActiveTab = (pathname: string) => {
    if (pathname.startsWith('/map')) {
      if (pathname.endsWith('/confirmed')) return '/promise';
      return '/map';
    }
    if (pathname.startsWith('/promise')) return '/promise';
    if (pathname.startsWith('/account')) return '/account';
    return '/home';
  };

  const activeTab = getActiveTab(pathname);

  return (
    <nav className="flex justify-between items-center fixed bottom-1 w-full px-9.5 py-3.75 bg-[#FFFFFF] shadow-[0_4px_20px_0_rgba(17,17,17,0.04)] rounded-t-[20px]">
      {tabs.map(({ path, label, defaultIcon, activeIcon }) => (
        <button
          key={path}
          onClick={() => handleTabClick(path)}
          className="flex flex-col items-center gap-1.25 text-xs"
        >
          <img
            src={activeTab === path ? activeIcon : defaultIcon}
            alt={label}
          />
          <span className="font-normal font-Pretendard leading-4 text-[#111111]">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNavBar;
