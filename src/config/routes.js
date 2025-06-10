import Home from '../pages/Home';

export const routes = [
  {
    id: 'home',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Home
  }
];

export const routeArray = Object.values(routes);