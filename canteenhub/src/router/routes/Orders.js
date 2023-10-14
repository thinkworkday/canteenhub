import { lazy } from 'react';

const OrderRoutes = [
  {
    path: '/admin/orders/list',
    component: lazy(() => import('../../views/orders/orders/list')),
    exact: true,
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/group/orders/list',
    component: lazy(() => import('../../views/orders/orders/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/vendor/orders/list',
    component: lazy(() => import('../../views/orders/orders/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/store/orders/list',
    component: lazy(() => import('../../views/orders/orders/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/admin/order/edit/:orderNumber',
    component: lazy(() => import('../../views/orders/orders/edit')),
    exact: true,
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/vendor/order/edit/:orderNumber',
    component: lazy(() => import('../../views/orders/orders/edit')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/store/order/edit/:orderNumber',
    component: lazy(() => import('../../views/orders/orders/edit')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/group/order/edit/:orderNumber',
    component: lazy(() => import('../../views/orders/orders/edit')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
];

export default OrderRoutes;
