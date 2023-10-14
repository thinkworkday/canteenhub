import {
  Home, Users, FileText, BookOpen, ShoppingBag, DollarSign, Slack, Airplay,
} from 'react-feather';

export default [
  {
    id: 'home',
    title: 'Dashboard',
    icon: <Home size={20} />,
    navLink: '/admin/dashboard',
  },

  {
    id: 'users',
    title: 'Users',
    icon: <Users size={20} />,
    children: [
      {
        id: 'administrators',
        title: 'Administrators',
        navLink: '/admin/users/administrators',
      },
      {
        id: 'vendors',
        title: 'Vendors',
        navLink: '/admin/users/vendors',
      },
      {
        id: 'groups',
        title: 'Groups',
        navLink: '/admin/users/groups',
      },
      {
        id: 'customers',
        title: 'Customers',
        navLink: '/admin/users/customers',
      },
    ],
  },

  {
    id: 'menus',
    title: 'Store Menus',
    icon: <BookOpen size={20} />,
    // badge: 'light-warning',
    // badgeText: '2',
    children: [
      {
        id: 'menus',
        title: 'All Menus',
        navLink: '/admin/menus/list',
      },
      {
        id: 'menuItems',
        title: 'Menu Items',
        navLink: '/admin/menu-items/list',
      },
      {
        id: 'menuOptions',
        title: 'Menu Options',
        navLink: '/admin/menu-options/list',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders',
    icon: <ShoppingBag size={20} />,
    // badge: 'light-warning',
    // badgeText: '2',
    children: [
      {
        id: 'orders',
        title: 'All Orders',
        navLink: '/admin/orders/list',
      },
      {
        id: 'orderEvents',
        title: 'Order Events',
        navLink: '/admin/order-dates/list',
      },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: <DollarSign size={20} />,
    // badge: 'light-warning',
    // badgeText: '2',
    children: [
      {
        id: 'payouts',
        title: 'Payouts',
        navLink: '/admin/finance/payouts/list',
      },
      {
        id: 'orderTransactions',
        title: 'Order Transactions',
        navLink: '/admin/transactions/list',
      },
    ],
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: <FileText size={20} />,
    navLink: '/vendor/reports',
    children: [
      {
        id: 'orderPicklist',
        title: 'Order Picklist',
        navLink: '/admin/reports/order-picklist',
      },
      {
        id: 'payoutReport',
        title: 'Payout Report',
        navLink: '/admin/reports/payout-report',
      },
    ],
  },
  {
    id: 'marketSite',
    title: 'Market Site',
    icon: <Slack size={20} />,
    navLink: '/mareket/site',
    children: [
      {
        id: 'marketContent',
        title: 'Content',
        navLink: '/admin/market/contents',
      },
      {
        id: 'marketWork',
        title: 'Work',
        navLink: '/admin/market/works',
      },
      {
        id: 'marketProvide',
        title: 'Provide',
        navLink: '/admin/market/provides',
      },
      {
        id: 'marketPartner',
        title: 'Partner',
        navLink: '/admin/market/partners',
      },
      {
        id: 'marketSchool',
        title: 'Schools',
        navLink: '/admin/market/schools',
      },
      {
        id: 'marketFeedback',
        title: 'Feedback',
        navLink: '/admin/market/feedbacks',
      },
    ],
  },
  {
    id: 'newsLetter',
    title: 'NewsLetter',
    icon: <Airplay size={20} />,
    navLink: '/admin/newsletter',
  },
  // {
  //   id: 'raiseSupport',
  //   title: 'Raise Support',
  //   icon: <LifeBuoy size={20} />,
  //   externalLink: true,
  //   newTab: true,
  //   navLink: 'https://pixinvent.ticksy.com/',
  // },
  // {
  //   id: 'users',
  //   title: 'Users',
  //   // icon: <Mail size={20} />,
  //   navLink: '/users',
  // },
  // {
  //   id: 'secondPage',
  //   title: 'Second Page',
  //   // icon: <Mail size={20} />,
  //   navLink: '/second-page',
  // },
];
