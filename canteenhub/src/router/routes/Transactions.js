import { lazy } from 'react';

const TransactionRoutes = [
  {
    path: '/admin/transactions/list',
    component: lazy(() => import('../../views/orders/transactions/list')),
    exact: true,
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/transaction/view/:transactionId',
    component: lazy(() => import('../../views/orders/transactions/view')),
    exact: true,
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/customer/transactions/list',
    component: lazy(() => import('../../views/orders/transactions/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'customer',
      action: 'read',
    },
  },
  {
    path: '/customer/transaction/view/:transactionId',
    component: lazy(() => import('../../views/orders/transactions/view')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'customer',
      action: 'read',
    },
  },

  // {
  //   path: '/admin/order/edit/:orderNumber',
  //   component: lazy(() => import('../../views/orders/orders/edit')),
  //   exact: true,
  //   layout: 'VerticalLayout',
  //   meta: {
  //     resource: 'admin',
  //     action: 'read',
  //   },
  // },
  // {
  //   path: '/vendor/order/edit/:orderNumber',
  //   component: lazy(() => import('../../views/orders/orders/edit')),
  //   exact: true,
  //   layout: 'HorizontalLayout',
  //   meta: {
  //     resource: 'vendor',
  //     action: 'read',
  //   },
  // },
];

export default TransactionRoutes;
