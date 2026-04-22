import { Outlet } from 'react-router-dom';
import ScreenContainer from './ScreenContainer';
import BottomNavBar from './BottomNavBar';

const MainLayout = () => {
  return (
    <ScreenContainer>
      <Outlet />
      <BottomNavBar />
    </ScreenContainer>
  );
};

export default MainLayout;
