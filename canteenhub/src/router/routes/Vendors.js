import { lazy } from 'react';

const VendorsRoutes = [
  {
    path: '/vendor/me',
    component: lazy(() => import('../../views/vendors/me')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/calendar',
    component: lazy(() => import('../../views/calendar')),
    layout: 'HorizontalLayout',
    exact: true,
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/order-dates',
    component: lazy(() => import('../../views/vendors/order-dates/list')),
    layout: 'HorizontalLayout',
    exact: true,
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/order-dates/edit/:id',
    component: lazy(() => import('../../views/vendors/order-dates/edit')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/stores',
    component: lazy(() => import('../../views/vendors/stores/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/store/add',
    component: lazy(() => import('../../views/vendors/stores/add')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/store/edit/:id/:stripeStatus?',
    component: lazy(() => import('../../views/vendors/stores/edit')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  // {
  //   path: '/store/handleConnectedAccountReturn/:id/:stripeStatus?',
  //   component: lazy(() => import('../../views/vendors/stores/edit')),
  //   layout: 'HorizontalLayout',
  //   meta: {
  //     resource: 'vendor',
  //     action: 'read',
  //   },
  // },
  {
    path: '/vendor/store-users',
    component: lazy(() => import('../../views/users/storeUsers/list')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
    exact: true,
  },
  {
    path: '/vendor/store-users/edit/:id',
    component: lazy(() => import('../../views/users/storeUsers/edit')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/schools',
    component: lazy(() => import('../../views/vendors/schools/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/school/invite',
    component: lazy(() => import('../../views/vendors/stores/add')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/finance/payouts/list',
    component: lazy(() => import('../../views/vendors/finance/payouts/list')),
    layout: 'HorizontalLayout',
    exact: true,
    meta: {
      resource: 'vendor',
      action: 'read',
    },

  },
];

export default VendorsRoutes;
