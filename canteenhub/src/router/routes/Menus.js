import { lazy } from 'react';

const MenuRoutes = [
  {
    path: '/admin/menus/list',
    component: lazy(() => import('../../views/menus/menus/list')),
    exact: true,
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/menus/add/',
    component: lazy(() => import('../../views/menus/menus/add')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/menus/edit/:id',
    component: lazy(() => import('../../views/menus/menus/edit')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/menu-items/list',
    component: lazy(() => import('../../views/menus/items/list')),
    exact: true,
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/menu-items/edit/:id',
    component: lazy(() => import('../../views/menus/items/edit')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/menu-options/list',
    component: lazy(() => import('../../views/menus/options/list')),
    exact: true,
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/vendor/menus/add/',
    component: lazy(() => import('../../views/menus/menus/add')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/menus/edit/:id',
    component: lazy(() => import('../../views/menus/menus/edit')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/menus/list',
    component: lazy(() => import('../../views/menus/menus/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/vendor/menus/view/:id',
    component: lazy(() => import('../../views/menus/menus/view')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'vendor',
      action: 'read',
    },
  },
  {
    path: '/store/menus/add/',
    component: lazy(() => import('../../views/menus/menus/add')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/store/menus/edit/:id',
    component: lazy(() => import('../../views/menus/menus/edit')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/store/menus/list',
    component: lazy(() => import('../../views/menus/menus/list')),
    exact: true,
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/store/menus/view/:id',
    component: lazy(() => import('../../views/menus/menus/view')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'store',
      action: 'read',
    },
  },
  {
    path: '/group/menus/view/:id',
    component: lazy(() => import('../../views/menus/menus/view')),
    layout: 'HorizontalLayout',
    meta: {
      resource: 'group',
      action: 'read',
    },
  },
];

export default MenuRoutes;
