import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import Splash from '@/components/splash/Splash';
import Account from '@/pages/account/Account';
import Home from '@/pages/home/Home';
import Login from '@/pages/login/Login';
import Map from '@/pages/map/Map';
import NotFound from '@/pages/notFound/NotFound';
import Promise from '@/pages/promise/Promise';
import CreatePromiseForm from '@/pages/promise/CreatePromiseForm';
import PromiseMap from '@/pages/map/PromiseMap';

const router = createBrowserRouter([
  { path: '/', element: <Splash /> },
  { path: '/login', element: <Login /> },
  {
    element: <MainLayout />,
    children: [
      { path: '/home', element: <Home /> },
      { path: '/map', element: <Map /> },
      { path: '/map/:promiseId', element: <PromiseMap /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/promise', element: <Promise /> },
          { path: '/promise/create', element: <CreatePromiseForm /> },
          { path: '/account', element: <Account /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
]);

export default router;
