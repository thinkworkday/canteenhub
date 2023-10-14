import { lazy } from 'react';
// import { Redirect } from 'react-router-dom';

const PagesRoutes = [
  {
    path: '/terms-and-conditions',
    component: lazy(() => import('../../views/pages/misc/Terms')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true,
    },
  },
  {
    path: '/privacy-policy',
    component: lazy(() => import('../../views/pages/misc/Privacy')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true,
    },
  },
  {
    path: '/newsletter',
    component: lazy(() => import('../../views/pages/misc/NewsletterView')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true,
    },
  },
  {
    path: '/redirect/callback',
    component: lazy(() => import('../../views/pages/misc/Callback')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true,
    },
  },
];
// {
//   path: '/pages/profile',
//   component: lazy(() => import('../../views/pages/profile')),
// },
// {
//   path: '/pages/faq',
//   component: lazy(() => import('../../views/pages/faq')),
// },
// {
//   path: '/pages/knowledge-base',
//   exact: true,
//   component: lazy(() => import('../../views/pages/knowledge-base/KnowledgeBase')),
// },
// {
//   path: '/pages/knowledge-base/:category',
//   exact: true,
//   component: lazy(() => import('../../views/pages/knowledge-base/KnowledgeBaseCategory')),
//   meta: {
//     navLink: '/pages/knowledge-base',
//   },
// },
// {
//   path: '/pages/knowledge-base/:category/:question',
//   component: lazy(() => import('../../views/pages/knowledge-base/KnowledgeBaseCategoryQuestion')),
//   meta: {
//     navLink: '/pages/knowledge-base',
//   },
// },
// {
//   path: '/pages/account-settings',
//   component: lazy(() => import('../../views/pages/account-settings')),
// },
// {
//   path: '/pages/blog/list',
//   exact: true,
//   component: lazy(() => import('../../views/pages/blog/list')),
// },
// {
//   path: '/pages/blog/detail/:id',
//   exact: true,
//   component: lazy(() => import('../../views/pages/blog/details')),
//   meta: {
//     navLink: '/pages/blog/detail',
//   },
// },
// {
//   path: '/pages/blog/detail',
//   exact: true,
//   component: () => <Redirect to="/pages/blog/detail/1" />,
// },
// {
//   path: '/pages/blog/edit/:id',
//   exact: true,
//   component: lazy(() => import('../../views/pages/blog/edit')),
//   meta: {
//     navLink: '/pages/blog/edit',
//   },
// },
// {
//   path: '/pages/blog/edit',
//   exact: true,
//   component: () => <Redirect to="/pages/blog/edit/1" />,
// },
// {
//   path: '/pages/pricing',
//   component: lazy(() => import('../../views/pages/pricing')),
// },
// {
//   path: '/misc/coming-soon',
//   component: lazy(() => import('../../views/pages/misc/ComingSoon')),
//   layout: 'BlankLayout',
//   meta: {
//     publicRoute: true,
//   },
// },

export default PagesRoutes;
