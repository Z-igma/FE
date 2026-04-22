import MainLayout from '@/components/layout/MainLayout';
import Splash from '@/components/splash/Splash';
import Account from '@/pages/account/Account';
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import Map from '@/pages/map/Map';
import NotFound from '@/pages/notFound/NotFound';
import Schedule from '@/pages/schedule/Schedule';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/login', element: <Login /> },
  {
    element: <MainLayout />,
    children: [
      { path: '/home', element: <Home /> },
      { path: '/map', element: <Map /> },
      { path: '/schedule', element: <Schedule /> },
      { path: '/account', element: <Account /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
