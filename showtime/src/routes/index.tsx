import { RouteObject } from 'react-router-dom';

import ArnieDetails from '../components/ArnieDetails';
import ArnieList from '../components/ArnieList';
import Home from '../components/Home';
import Layout from '../components/Layout';
import NoMatch from '../components/NoMatch';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/arnies',
        element: <ArnieList />,
      },
      {
        path: '/arnies/:id',
        element: <ArnieDetails />,
      },
      {
        path: '*',
        element: <NoMatch />,
      },
    ],
  },
];

export default routes;
