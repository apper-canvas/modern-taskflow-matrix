import HomePage from '@/components/pages/HomePage';

export const routes = [
  {
    id: 'home',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
component: HomePage
  }
];

export const routeArray = Object.values(routes);