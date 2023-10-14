export default [
  {
    id: 'orders',
    title: 'Orders',
    navLink: '/vendor/orders/list',
  },
  {
    id: 'events',
    title: 'Events',
    children: [
      {
        id: 'calendar',
        title: 'Calendar',
        navLink: '/vendor/calendar',
      },
      {
        id: 'events',
        title: 'Events List',
        navLink: '/vendor/order-dates',
      },
    ],
  },

  {
    id: 'menus',
    title: 'Menus',
    navLink: '/vendor/menus/list',
  },
  {
    id: 'schools',
    title: 'Schools',
    navLink: '/vendor/schools',
  },
  {
    id: 'reports',
    title: 'Reports',
    navLink: '/vendor/reports',
    children: [
      {
        id: 'orderPicklist',
        title: 'Order Picklist',
        navLink: '/vendor/reports/order-picklist',
      },
      {
        id: 'payoutReport',
        title: 'Payout Report',
        navLink: '/vendor/reports/payout-report',
      },
    ],
  },
  {
    id: 'more',
    title: 'More',
    navLink: '/more',
    children: [
      {
        id: 'stores',
        title: 'Stores',
        navLink: '/vendor/stores',
      },
      {
        id: 'storesUsers',
        title: 'Store Users',
        navLink: '/vendor/store-users',
      },
    ],
  },
  {
    id: 'help',
    title: 'Help',
    navLink: 'https://vendorsupport.canteenhub.com/portal/en/signin',
    externalLink: true,
    newTab: true,
  },
];
