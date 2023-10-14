import { lazy } from 'react';

const MarketRoutes = [
  // Market Site
  {
    path: '/admin/market/contents',
    component: lazy(() => import('../../views/admin/market/content/list')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/content/add',
    component: lazy(() => import('../../views/admin/market/content/add')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/content/edit/:id',
    component: lazy(() => import('../../views/admin/market/content/edit')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/works',
    component: lazy(() => import('../../views/admin/market/work/list')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/work/add',
    component: lazy(() => import('../../views/admin/market/work/add')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/work/edit/:id',
    component: lazy(() => import('../../views/admin/market/work/edit')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/provides',
    component: lazy(() => import('../../views/admin/market/provide/list')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/provide/add',
    component: lazy(() => import('../../views/admin/market/provide/add')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/provide/edit/:id',
    component: lazy(() => import('../../views/admin/market/provide/edit')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/partners',
    component: lazy(() => import('../../views/admin/market/partner/list')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/partner/add',
    component: lazy(() => import('../../views/admin/market/partner/add')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/partner/edit/:id',
    component: lazy(() => import('../../views/admin/market/partner/edit')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/schools',
    component: lazy(() => import('../../views/admin/market/school/list')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/school/add',
    component: lazy(() => import('../../views/admin/market/school/add')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/school/edit/:id',
    component: lazy(() => import('../../views/admin/market/school/edit')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/feedbacks',
    component: lazy(() => import('../../views/admin/market/feedback/list')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/feedback/add',
    component: lazy(() => import('../../views/admin/market/feedback/add')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
  {
    path: '/admin/market/feedback/edit/:id',
    component: lazy(() => import('../../views/admin/market/feedback/edit')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
];

export default MarketRoutes;
