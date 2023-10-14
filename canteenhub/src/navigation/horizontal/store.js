export default [
  {
    id: 'orders',
    title: 'Orders',
    navLink: '/store/orders/list',
  },
  {
    id: 'events',
    title: 'Events',
    children: [
      {
        id: 'calendar',
        title: 'Calendar',
        navLink: '/store/calendar',
      },
      {
        id: 'events',
        title: 'Events List',
        navLink: '/store/order-dates',
      },
    ],
  },
  {
    id: 'menus',
    title: 'Menus',
    navLink: '/store/menus/list',
  },
  // {
  //   id: 'stores',
  //   title: 'Stores',
  //   navLink: '/store/stores/list',
  // },
  {
    id: 'reports',
    title: 'Reports',
    navLink: '/store/reports',
    children: [
      {
        id: 'orderPicklist',
        title: 'Order Picklist',
        navLink: '/store/reports/order-picklist',
      },
    ],
  },
];
