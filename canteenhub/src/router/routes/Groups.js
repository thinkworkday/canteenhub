import { lazy } from 'react';
// import { Redirect } from 'react-router-dom';

const GroupRoutes = [
  {
    path: '/group/me',
    component: lazy(() => import('../../views/groups/me')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/group/subgroups',
    component: lazy(() => import('../../views/groups/subgroups/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/group/subgroups/add',
    component: lazy(() => import('../../views/groups/subgroups/form')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/group/subgroups/edit/:id',
    component: lazy(() => import('../../views/groups/subgroups/form')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/group/subgroups/form/:mode/:id?',
    component: lazy(() => import('../../views/groups/subgroups/form')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/group/subgroups/invite/:id',
    component: lazy(() => import('../../views/groups/subgroups/invite')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/group/order-dates',
    component: lazy(() => import('../../views/groups/order-dates/list')),
    layout: 'HorizontalLayout',
    exact: true,
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/group/order-dates/view/:id',
    component: lazy(() => import('../../views/groups/order-dates/edit')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
  {
    path: '/group/order-dates-pending',
    component: lazy(() => import('../../views/groups/order-dates/list-pending')),
    layout: 'HorizontalLayout',
    exact: true,
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
];

export default GroupRoutes;
