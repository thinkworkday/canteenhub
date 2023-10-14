import { Mail, Home } from 'react-feather';

export default [
  // {
  //   id: 'home',
  //   title: 'Dashboard',
  //   // icon: <Home size={20} />,
  //   navLink: '/',
  // },

  {
    id: 'events',
    title: 'Events',
    // icon: <Mail size={20} />,
    // navLink: '/vendor/orders',
    children: [
      // {
      //   id: 'calendar',
      //   title: 'Calendar',
      //   // icon: <Mail size={20} />,
      //   navLink: '/vendor/orders/list',
      // },
      {
        id: 'order-dates',
        title: 'All Events',
        // icon: <Mail size={20} />,
        navLink: '/group/order-dates',
      },
      {
        id: 'order-dates-pending',
        title: 'Awaiting Approval',
        // icon: <Mail size={20} />,
        navLink: '/group/order-dates-pending',
      },
    ],
  },
  {
    id: 'orders',
    title: 'Orders',
    // icon: <Mail size={20} />,
    navLink: '/group/orders/list',
  },
  {
    id: 'classrooms',
    title: 'Classrooms',
    // icon: <Mail size={20} />,
    navLink: '/group/subgroups',
  },

  // {
  //   id: 'more',
  //   title: 'More',
  //   // icon: <Mail size={20} />,
  //   navLink: '/more',
  //   children: [
  //     {
  //       id: 'stores',
  //       title: 'Stores',
  //       // icon: <Mail size={20} />,
  //       navLink: '/vendor/stores',
  //     },
  //     {
  //       id: 'storesUsers',
  //       title: 'Store Users',
  //       // icon: <Mail size={20} />,
  //       navLink: '/vendor/store-users',
  //     },
  //   ],
  // },
];
