export default [
  {
    id: 'orders',
    title: 'Orders',
    navLink: '/orders',
  },
  {
    id: 'events',
    title: 'Events',
    navLink: '/events',
  },
  {
    id: 'menus',
    title: 'Menus',
    navLink: '/second-page',
  },
  {
    id: 'schools',
    title: 'Schools',
    navLink: '/vendor/schools',
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
];
