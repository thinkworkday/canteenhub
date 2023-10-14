// ** React Imports
import { useState } from 'react';

// ** Store & Actions
import moment from 'moment';
import { store } from '../redux/storeConfig/store';

// ** Set Page title
export const pageTitle = (title) => {
  document.title = title;
  return document.title;
};

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns price format
export const priceFormatter = (num) => (`$${Number(num).toFixed(2).toLocaleString()}`);

// ** Returns price format
export const priceFormatterNoCurrency = (num) => (`${Number(num).toFixed(2).toLocaleString()}`);

// ** Returns K format from a number
export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num);

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, '');

// ** Checks if the passed date is today
const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

// ** Checks if the passed date is today
export const getInitials = (str) => {
  const results = [];
  const wordArray = str.split(' ');
  wordArray.forEach((e) => {
    results.push(e[0]);
  });
  return results.join('');
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = 'full') => {
  if (!value) return value;
  const formattedDate = formatting === 'full' ? moment(`${value}`).format('llll') : moment(`${value}`).format('ddd, Do MMM YYYY');
  return formattedDate;
  // return new Intl.DateTimeFormat('en-AU', formatting).format(new Date(value));
};

export const formatDateTZ = (dateUTC, timezone) => {
  if (!dateUTC) return dateUTC;
  const formattedDate = new Date(dateUTC).toLocaleString('en-AU', {
    timeZone: timezone || 'Australia/Melbourne',
    weekday: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    year: 'numeric',
    month: 'short',
  });
  return formattedDate;
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: 'short', day: 'numeric' };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' };
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value));
};

export const getDeliveryOnlyDate = (orderDate) => {
  const formattedDate = moment(orderDate).format('ddd, MMM DD, YYYY');
  return formattedDate;
};

export const getDeliveryDate = (orderDate, deliveryTime) => {
  const formattedDate = moment(orderDate).format('YYYY-M-D'); // '2017-03-13';
  const convertTime12to24 = deliveryTime ? moment(deliveryTime, 'hh:mm A').format('HH:mm') : '';
  const formattedDateMoment = moment(`${formattedDate} ${convertTime12to24}`, 'YYYY-MM-DD HH:mm:ss A');
  const timeAndDate = deliveryTime ? moment(formattedDateMoment).format('llll') : moment(`${formattedDate}`, 'YYYY-MM-DD HH:mm:ss A').format('llll');
  return timeAndDate;
};

export const getCutOffDate = (orderDate, cutoffPeriod, showAsFrom) => {
  const cutOffDate = showAsFrom ? moment(orderDate).subtract(cutoffPeriod, 'hours').fromNow() : moment(orderDate).subtract(cutoffPeriod, 'hours').format('llll');
  return cutOffDate;
};

export const isInThePast = (date) => moment(new Date(date), 'hh:mm A').format('YYYY-MM-DD HH:mm:ss A') < moment(new Date(), 'hh:mm A').utc().format('YYYY-MM-DD HH:mm:ss A');

// ** Gets Invite Status
export const getInviteStatus = (invite) => {
  let inviteStatus = invite.status;
  let inviteAgeHours;
  if (invite.status === 'pending') {
    inviteAgeHours = (moment(new Date(invite.createdAt), 'YYYY/MM/DD', true).diff(moment(new Date(), 'YYYY/MM/DD', true), 'hours')) * -1;
    if (inviteAgeHours > 48) {
      inviteStatus = 'expired';
    }
  }
  return inviteStatus;
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */

export const isUserLoggedIn = () => localStorage.getItem('accessToken');

// ** DEPRECATED (replace with getLoggedUser)
export const getUserData = () => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData) {
    userData.accessToken = localStorage.getItem('accessToken');
  }
  return userData;
};

// Get Logged User (uses State instead of Local Storage)
export const getLoggedUser = () => {
  const storedUser = store.getState().auth.userData; // get from State
  if (storedUser) {
    storedUser.accessToken = localStorage.getItem('accessToken');
  }
  return storedUser;
};

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === 'admin') return '/admin/dashboard';
  if (userRole === 'vendor') return '/vendor/dashboard';
  if (userRole === 'store') return '/store/dashboard';
  if ((userRole === 'group') || (userRole === 'school')) return '/group/dashboard';
  if (userRole === 'customer') return '/customer/dashboard';
  return '/';
};

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed', // for input hover border-color
  },
});

// ** Canteen Hub specific

// ** Format Menu Items for DB entry
export const formatMenuForDB = (updatedMenuData) => {
  const formattedMenuData = updatedMenuData.map((obj) => {
    let isArray = [];
    if (obj.items) {
      isArray = obj.items.map((objItems) => {
        if (objItems._id) {
          return objItems._id;
        }
        return null;
      });
    }
    isArray = isArray.filter((x) => x != null);
    if (isArray.length > 0) {
      obj.items = isArray;
    }
    return obj;
  });
  return formattedMenuData;
};

// ** Calculate Order Totals
export const calculateOrderTotals = async (currentOrder) => {
  const orderLineTotals = currentOrder.orderLines.map((orderLine) => {
    let lineSubtotal = 0;
    lineSubtotal += orderLine.subtotal * (orderLine.events ? orderLine.events.length : 0);
    return lineSubtotal;
  });

  const orderLineLateFees = currentOrder.orderLines.map((orderLine) => {
    let lineLateFee = 0;
    if (orderLine.events) {
      orderLine.events.forEach((event) => {
        const deliveryDate = getDeliveryDate(event.date, event.deliveryTime);
        const cutoffDateRaw = getCutOffDate(deliveryDate, event.cutoffPeriod, false);
        lineLateFee += orderLine.subtotal * (!moment(cutoffDateRaw).isAfter() ? process.env.REACT_APP_LATE_FEE / 100 : 0);
      });
    }
    return lineLateFee;
  });
  const orderCurrency = currentOrder && currentOrder.orderLines.length > 0 ? currentOrder.orderLines[0].currency : 'AUD';
  const orderEvents = currentOrder && currentOrder.events ? currentOrder.events.length : 0;
  const orderLinesSubtotal = (orderLineTotals.reduce((partialSum, a) => partialSum + a, 0));
  const orderLinesLateFeetotal = (orderLineLateFees.reduce((pSum, a) => pSum + a, 0));
  const orderSubtotal = orderLinesSubtotal;
  const orderLateFees = orderLinesLateFeetotal;
  const orderTax = (orderSubtotal / 11); // includes GST
  const orderFees = orderSubtotal * (process.env.REACT_APP_TRANSACTION_FEE / 100);
  const orderTotal = orderSubtotal + orderFees + orderLateFees;

  return [
    {
      orderCurrency,
      orderEvents,
      orderLinesSubtotal,
      orderSubtotal,
      orderTax,
      orderFees,
      orderLateFees,
      orderDiscount: 0,
      orderDonation: 0,
      orderTotal,
    },
  ];
};

// ** Build Order Data (DEPRECATED - now completed at backend)
export const buildOrderData = async (currentOrder, paymentData) => {
  const orderData = [];

  const newOrderLines = [];
  currentOrder.orderLines.forEach((orderLine) => {
    const idx = newOrderLines.findIndex((e) => e.profile._id === orderLine.profile._id);
    if (idx < 0) { // Create a profile to save orderLines
      const events = {};
      orderLine.events.forEach((event) => {
        events[event._id] = [orderLine];
      });

      newOrderLines.push({
        profile: orderLine.profile,
        events,
      });
    } else {
      orderLine.events.forEach((event) => {
        if (!newOrderLines[idx].events[event._id]) { // Create an event to a profile it the event is not existed
          newOrderLines[idx].events[event._id] = [orderLine]; // Add an orderLine to the new created event
        } else {
          newOrderLines[idx].events[event._id].push(orderLine); // Add an orderLine to the existing event of a profile
        }
      });
    }
  });

  // let orderCount = 0;
  // newOrderLines.forEach((orderLine) => { // Loop for every profile
  //   // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unused-vars
  //   for (const eventId in orderLine.events) { // Loop for every event
  //     orderCount += 1;
  //   }
  // });

  newOrderLines.forEach((orderLine) => { // Loop for every profile
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const eventId in orderLine.events) { // Loop for every event
      const event = orderLine.events[eventId][0].events.find((e) => e._id === eventId); // find the event

      // const orderFees = currentOrder.orderTotals[0].orderFees / orderCount;

      // console.log('currentOrder', currentOrder);

      // Set status
      const deliveryDate = getDeliveryDate(event.date, event.deliveryTime);
      const cutoffDateRaw = getCutOffDate(deliveryDate, event.cutoffPeriod, false);
      const isCutoff = !!isInThePast(new Date(cutoffDateRaw));

      const orderLinesSubtotal = orderLine.events[eventId].reduce((a, b) => a + b.qty * b.priceEach, 0);
      const orderFees = orderLinesSubtotal * (process.env.REACT_APP_TRANSACTION_FEE / 100);
      const orderSubtotal = orderLine.events[eventId].reduce((a, b) => a + b.subtotal, 0); // line items no fees
      const orderTax = orderSubtotal / 11; // line items no fees

      orderData.push({
        event,
        vendor: event.vendor,
        customer: currentOrder.customer,
        orderLines: orderLine.events[eventId],
        orderTotals: [
          {
            ...currentOrder.orderTotals[0],
            orderEvents: 1,
            orderLinesSubtotal,
            orderFees,
            orderSubtotal,
            orderTax,
            orderTotal: orderSubtotal + orderFees,
          },
        ],
        profile: orderLine.profile,
        status: isCutoff ? 'pending' : 'active',
        transactionData: {
          client_secret: paymentData.client_secret,
          id: paymentData.id,
          payment_method: paymentData.payment_method,
          amount_paid: paymentData.amount_received,
          transaction_fees: currentOrder.orderTotals[0].orderFees,
          transaction_total: currentOrder.orderTotals[0].orderTotal,
        },
      });
    }
  });

  return orderData;
};

// ** Get Settings from DB
// export const getSettings = async () => {
//   const settings = await axios
//     .get(`${process.env.REACT_APP_SERVER_URL}/api/settings`, { headers })
//     .then((response) => response.data[0])
//     // eslint-disable-next-line no-console
//     .catch((err) => console.log(err));

//   return { ...settings };
// };

// ** Get Vendor Commission
export const getVendorCommission = async (vendor) => {
  // if (vendor.role !== 'vendor') {
  //   return false;
  // }
  if (typeof vendor.commission !== 'undefined' && vendor.commission) {
    return vendor.commission;
  }

  // get vendor details
  return 6; // DEFAULT_COMMISSION (6%)
};

// ** Returns commission amount based on price
export const fetchCommission = (amount, vendor) => {
  if (!amount) return amount;
  const [commission, setCommission] = useState();
  getVendorCommission(vendor).then((result) => (setCommission(result)));
  const commissionAmount = ((commission / 100) * amount);
  return commissionAmount;
};
