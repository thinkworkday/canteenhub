import { lazy } from 'react';
import { Redirect } from 'react-router-dom';

const CustomerRoutes = [
  {
    path: '/customer/me',
    component: lazy(() => import('../../views/customers/me')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'customer',
      action: 'read',
    },
  },
  {
    path: '/customer/profiles',
    component: lazy(() => import('../../views/customers/profiles/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'customer',
      action: 'read',
    },
  },
  {
    path: '/customer/profiles/form/:mode/:id?',
    component: lazy(() => import('../../views/customers/profiles/form')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'customer',
      action: 'read',
    },
  },
  {
    path: '/customer/orders/list',
    component: lazy(() => import('../../views/orders/orders/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'customer',
      action: 'read',
    },
  },
  {
    path: '/customer/order/edit/:orderNumber',
    component: lazy(() => import('../../views/orders/orders/edit')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'customer',
      action: 'read',
    },
  },
  {
    path: '/customer/order/checkout',
    component: lazy(() => import('../../views/customers/checkout')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'customer',
      action: 'read',
    },
  },
  {
    path: '/customer/order/checkout/confirmation',
    component: lazy(() => import('../../views/customers/checkout/steps/Confirmation')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'customer',
      action: 'read',
    },
  },
];

export default CustomerRoutes;
