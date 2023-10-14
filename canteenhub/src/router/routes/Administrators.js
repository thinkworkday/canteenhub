import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const AdminRoutes = [
  {
    path: '/admin/order-dates/list',
    component: lazy(() => import('../../views/admin/order-dates/list')),
    layout: 'VerticalLayout',
    exact: true,
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/order-dates/view/:id',
    component: lazy(() => import('../../views/admin/order-dates/edit')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/finance/payouts/list',
    component: lazy(() => import('../../views/admin/finance/payouts/list')),
    layout: 'VerticalLayout',
    exact: true,
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  // {
  //   path: '/admin/finance/payouts/view/:id',
  //   component: lazy(() => import('../../views/admin/finance/payouts/edit')),
  //   layout: 'VerticalLayout',
  // },
];

export default AdminRoutes;
