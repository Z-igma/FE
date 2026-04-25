import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Splash from '@/components/splash/Splash';
import Account from '@/pages/account/Account';
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import Map from '@/pages/map/Map';
import NotFound from '@/pages/notFound/NotFound';
import Schedule from '@/pages/schedule/Schedule';
import CreateScheduleForm from '@/pages/schedule/CreateScheduleForm';

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/login', element: <Login /> },
  {
    element: <MainLayout />,
    children: [
      { path: '/home', element: <Home /> },
      { path: '/map', element: <Map /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/schedule', element: <Schedule /> },
          { path: '/schedule/create', element: <CreateScheduleForm /> },
          { path: '/account', element: <Account /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
