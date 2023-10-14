import { Mail, Home } from 'react-feather';

export default [
  {
    id: 'home',
    title: 'Dashboard',
    class: 'd-lg-none',
    navLink: '/customer/dashboard',
  },
  {
    id: 'orders',
    title: 'Orders',
    navLink: '/customer/orders/list',
  },
  {
    id: 'profiles',
    title: 'Profiles',
    navLink: '/customer/profiles',
  },
  {
    id: 'orderCta',
    title: 'Order Now!',
    isCta: true,
    navLink: '/customer/order/checkout',
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
  //       navLink: '/customer/profiles',
  //     },
  //     {
  //       id: 'storesUsers',
  //       title: 'Store Users',
  //       // icon: <Mail size={20} />,
  //       navLink: '/customer/profiles',
  //     },
  //   ],
  // },
];
