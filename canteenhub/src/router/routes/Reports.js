import { lazy } from 'react';

const OrderRoutes = [
  {
    path: '/vendor/reports/order-picklist',
    component: lazy(() => import('../../views/reports/ordersPicklist')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/reports/payout-report',
    component: lazy(() => import('../../views/reports/payoutReport')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/store/reports/order-picklist',
    component: lazy(() => import('../../views/reports/ordersPicklist')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/admin/reports/order-picklist',
    component: lazy(() => import('../../views/reports/ordersPicklist')),
    exact: true,
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/reports/payout-report',
    component: lazy(() => import('../../views/reports/payoutReport')),
    exact: true,
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
];

export default OrderRoutes;
