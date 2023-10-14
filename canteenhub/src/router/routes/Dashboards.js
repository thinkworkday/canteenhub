import { lazy } from 'react';

const DashboardRoutes = [
  // Dashboards
  {
    path: '/dashboard',
    component: lazy(() => import('../../views/Home')),
    layout: 'BlankLayout',
    meta: {
      navLink: '/',
    },
  },
  {
    path: '/admin/dashboard',
    component: lazy(() => import('../../views/pages/dashboards/admin')),
    meta: {
      resource: 'admin',
      action: 'read',
    },
    // meta: {
    //   navLink: '/',
    // },
  },
  {
    path: '/vendor/dashboard',
    component: lazy(() => import('../../views/pages/dashboards/vendor')),
    layout: 'HorizontalLayout',
    meta: {
      navLink: '/',
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/store/dashboard',
    component: lazy(() => import('../../views/pages/dashboards/vendor')),
    layout: 'HorizontalLayout',
    meta: {
      navLink: '/',
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/group/dashboard',
    component: lazy(() => import('../../views/pages/dashboards/group')),
    layout: 'HorizontalLayout',
    meta: {
      navLink: '/',
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/customer/dashboard',
    component: lazy(() => import('../../views/pages/dashboards/customer')),
    layout: 'HorizontalLayout',
    meta: {
      navLink: '/',
      resource: 'customer',
      action: 'read',
    },
  },
];

export default DashboardRoutes;
