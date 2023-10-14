import { lazy } from 'react';
// import { Redirect } from 'react-router-dom';

const PagesRoutes = [
  {
    path: '/admin/users/administrators',
    component: lazy(() => import('../../views/admin/users/administrators/list')),
    exact: true,
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/users/administrators/edit/:id',
    component: lazy(() => import('../../views/admin/users/administrators/edit')),
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/users/vendors',
    component: lazy(() => import('../../views/admin/users/vendors/list')),
    exact: true,
    meta: {
      navLink: '/users/vendors',
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/users/vendors/edit/:id',
    component: lazy(() => import('../../views/admin/users/vendors/edit')),
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/users/vendors/store/edit/:id',
    component: lazy(() => import('../../views/admin/users/vendors/stores/edit')),
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/users/groups',
    component: lazy(() => import('../../views/admin/users/groups/list')),
    meta: {
      resource: 'admin',
      action: 'read',
    },
    exact: true,
  },
  {
    path: '/admin/users/groups/edit/:id',
    component: lazy(() => import('../../views/admin/users/groups/edit')),
    meta: {
      navLink: '/users/groups',
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/users/customers',
    component: lazy(() => import('../../views/admin/users/customers/list')),
    meta: {
      resource: 'admin',
      action: 'read',
    },
    exact: true,
  },
  {
    path: '/admin/users/customers/edit/:id',
    component: lazy(() => import('../../views/admin/users/customers/edit')),
    meta: {
      navLink: '/admin/users/customers',
      resource: 'admin',
      action: 'read',
    },
  },
];

export default PagesRoutes;
