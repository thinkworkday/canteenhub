import { lazy } from 'react';

const NewsLetterRoutes = [
  // NewsLetter
  {
    path: '/admin/newsletter',
    component: lazy(() => import('../../views/admin/newsLetter')),
    layout: 'VerticalLayout',
    meta: {
      resource: 'admin',
      action: 'read',
    },
  },
];

export default NewsLetterRoutes;
