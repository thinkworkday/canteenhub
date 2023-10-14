import { lazy } from 'react';

const StoresRoutes = [
  {
    path: '/store/me',
    component: lazy(() => import('../../views/vendors/me')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/store/calendar',
    component: lazy(() => import('../../views/calendar')),
    layout: 'HorizontalLayout',
    exact: true,
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/store/order-dates',
    component: lazy(() => import('../../views/vendors/order-dates/list')),
    layout: 'HorizontalLayout',
    exact: true,
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/store/order-dates/edit/:id',
    component: lazy(() => import('../../views/vendors/order-dates/edit')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  // {
  //   path: '/store/stores/list',
  //   component: lazy(() => import('../../views/vendors/stores/list')),
  //   exact: true,
  //   layout: 'HorizontalLayout',
  //   meta: {
  //     resource: 'store',
  //     action: 'read',
  //   },
  // },
  // {
  //   path: '/store/store/edit/:id',
  //   component: lazy(() => import('../../views/vendors/stores/edit')),
  //   layout: 'HorizontalLayout',
  //   meta: {
  //     resource: 'store',
  //     action: 'read',
  //   },
  // },
  {
    path: '/store/school/invite',
    component: lazy(() => import('../../views/vendors/stores/add')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
];

export default StoresRoutes;
