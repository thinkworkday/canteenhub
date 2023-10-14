import { lazy } from 'react';

const PagesRoutes = [
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/auth/Login')),
    layout: 'PageLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/admin/login',
    component: lazy(() => import('../../views/pages/auth/AdminLogin')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/register',
    component: lazy(() => import('../../views/pages/auth/RegisterLanding')),
    layout: 'PageLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/register-partner',
    component: lazy(() => import('../../views/pages/auth/RegisterVendor')),
    layout: 'PageLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/register-group/:inviteId?',
    component: lazy(() => import('../../views/pages/auth/RegisterGroup')),
    layout: 'PageLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/register-customer',
    component: lazy(() => import('../../views/pages/auth/RegisterCustomer')),
    layout: 'PageLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/forgot-password',
    component: lazy(() => import('../../views/pages/auth/ForgotPassword')),
    layout: 'PageLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/reset-password/:code/:isAdmin?',
    component: lazy(() => import('../../views/pages/auth/ResetPassword')),
    layout: 'PageLayout',
    meta: {
      authRoute: true,
    },
  },
  {
    path: '/verify-email/:code',
    component: lazy(() => import('../../views/pages/auth/VerifyEmail')),
    layout: 'PageLayout',
    meta: {
      publicRoute: true,
    },
  },
  {
    path: '/invitation/:inviteId',
    component: lazy(() => import('../../views/pages/auth/InvitationGroup')),
    layout: 'PageLayout',
    meta: {
      publicRoute: true,
    },
  },
  {
    path: '/misc/not-authorized',
    component: lazy(() => import('../../views/pages/misc/NotAuthorized')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true,
    },
  },
  // {
  //   path: '/misc/maintenance',
  //   component: lazy(() => import('../../views/pages/misc/Maintenance')),
  //   layout: 'BlankLayout',
  //   meta: {
  //     publicRoute: true,
  //   },
  // },
  {
    path: '/misc/error',
    component: lazy(() => import('../../views/pages/misc/Error')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true,
    },
  },
];

export default PagesRoutes;
