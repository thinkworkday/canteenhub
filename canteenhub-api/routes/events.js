/* eslint-disable no-nested-ternary */
const router = require('express').Router();
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SEC_KEY);
const ObjectId = require('mongodb').ObjectID;

// const { isValidObjectId } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
// const ObjectId = require('mongodb').ObjectID;

// Date libraries
// const moment = require('moment');
const moment = require('moment-timezone');

const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');
// const { canIAccessRecord } = require('../utils/utils');

// ** Models
// const User = require('../model/User');
const Order = require('../model/Order');
const Menu = require('../model/Menu');
const Event = require('../model/Event');
const Profile = require('../model/Profiles');
const Transaction = require('../model/Transactions');

//* * Aggregate Pipelines */
const { eventPipeline } = require('../pipelines/aggregateEvents');

// const {
//   menuValidation,
// } = require('../utils/validation');

// ** SendGrid
const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

// ** utils
const { fetchStoreUserStores } = require('../utils/storeFunctions');

// **
// ** Create Event
// **
router.post('/create', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'customer', 'vendor', 'store']), async (req, res) => {
  const eventData = req.body.event;
  const eventDates = eventData.dates;
  delete eventData.dates;
  eventData.createdBy = res.user._id;
  eventData.createdByModel = (res.user.role === 'admin' ? 'Administrator' : 'User');

  // get cutoff datetime
  const eventDataArr = eventDates.map((eventDate) => {
    const deliveryDateTimeUTC = moment.tz(`${moment.tz(eventDate, eventData.timezone).format('MM/DD/YYYY')} ${eventData.deliveryTime}`, 'MM/DD/YYYY h:mm:ss A', eventData.timezone); // joins Date & Time and converts to UTC
    const cutoffDateTimeUTC = new Date(moment(deliveryDateTimeUTC).subtract(eventData.cutoffPeriod, 'hours'));
    return ({
      date: eventDate,
      deliveryDateTimeUTC,
      cutoffDateTimeUTC,
      ...eventData,
    });
  });

  // create one event for every date provided
  try {
    const savedEvents = await Event.insertMany(eventDataArr);
    return res.send({ events: savedEvents, message: 'Events successfully created' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// ** List Events (also gets orders)
// * Admin: List All
// * Vendor: List mine only
router.get('/list/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'group']), async (req, res) => {
  const isComing = !!(req.query && req.query.upcoming && req.query.upcoming === 'true');
  const vendorFilter = res.user.role === 'vendor' ? { vendor: ObjectId(res.user._id) } : {};
  const upcomingFilter = isComing ? { date: { $gt: new Date() } } : {};

  const statusFilter = typeof req.query.status !== 'undefined' && req.query.status !== ''
    ? { status: req.query.status }
    : { status: { $ne: 'deleted' } };

  let groupFilter = {};
  if (res.user.role === 'group') {
    groupFilter = { group: ObjectId(res.user._id) };
  } else if (req.query.group) {
    groupFilter = { group: ObjectId(req.query.group) };
  }

  // get stores if store user
  // const storeFilter = res.user.role === 'store' ? fetchStoreUserStores(res.user._id) : {};
  const storeFilter = typeof req.query.store !== 'undefined' && req.query.store !== ''
    ? { store: ObjectId(req.query.store) }
    : res.user.role === 'store' ? { store: { $in: await fetchStoreUserStores(res.user._id) } } : {};

  // Date event filter
  let dateEventFilter;
  if (typeof req.query.dateRange !== 'undefined' && req.query.dateRange[0]) {
    dateEventFilter = {
      date: {
        $gte: new Date(new Date(req.query.dateRange[0]).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(req.query.dateRange[1]).setHours(0, 0, 0, 0)),
      },
    };
  }

  const sortBy = req.query && req.query.sort && req.query.sort === 'asc' ? { date: 1 } : { date: -1 };

  // const createdByFilter = typeof req.query.status !== 'undefined' ? { status: req.query.status } : { status: { $ne: 'deleted' } };
  const updatedFilter = typeof req.query.updated !== 'undefined' ? {
    updatedAt: {
      $gte: moment().subtract({ minutes: req.query.updated }).toISOString(), // ISODate('2022-01-26T01:31:38.559+0000'),
    },
  } : {};

  // const searchQuery = typeof req.query.q !== 'undefined' ? req.query.q : '';
  const filterParams = {
    $and: [
    // {
    //   $or: [
    //     { name: { $regex: searchQuery, $options: 'i' } },
    //   // { companyName: { $regex: searchQuery, $options: 'i' } },
    //   ],
    // },
      groupFilter,
      vendorFilter,
      updatedFilter,
      statusFilter,
      upcomingFilter,
      storeFilter,
      // dateEventFilter,
    ],
  };

  const totalCount = await Event.countDocuments(filterParams);

  const events = await Event.aggregate(
    [
      {
        $match: {
          ...groupFilter,
          ...vendorFilter,
          ...updatedFilter,
          ...statusFilter,
          ...upcomingFilter,
          ...dateEventFilter,
          ...storeFilter,
        },
      },
      {
        $lookup: {
          from: 'stores',
          let: { store: '$store' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$store'] } } },
            { $project: { storeName: 1 } },
          ],
          as: 'store',
        },
      },
      { $unwind: { path: '$store' } },
      {
        $lookup: {
          from: 'users',
          let: { group: '$group' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$group'] } } },
            { $project: { companyName: 1 } },
          ],
          as: 'group',
        },
      },
      {
        $unwind: { path: '$group' },
      },
      {
        $addFields: { menus: { $ifNull: ['$menus', []] } },
      },
      {
        $lookup: {
          from: 'menus',
          let: { menus: '$menus' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$menus'] } } },
            { $project: { name: 1 } },
          ],
          as: 'menus',
        },
      },
      {
        $lookup: {
          from: 'menus',
          let: { menuVendor: '$vendor' },
          pipeline: [
            { $match: { $expr: { $in: ['$$menuVendor', { $ifNull: ['$vendors', []] }] } } },
            { $limit: 1 },
            { $project: { name: 1 } },
          ],
          as: 'menuDefault',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { vendor: '$vendor' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$vendor'] } } },
            { $project: { companyName: 1 } },
          ],
          as: 'vendor',
        },
      },
      {
        $unwind: { path: '$vendor' },
      },
      {
        $sort: {
          ...sortBy,
        },
      },
    ],
  );

  return res.send({
    totalCount,
    filteredCount: events.length,
    results: events,
  });
});

// ** List Upcoming for Profile
// * Customers Only
//    - requests Profile Obj Id
router.get('/upcoming/:profileObjId', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['group', 'customer']), async (req, res) => {
  // Get the profile
  if (!req.params.profileObjId) {
    return res.status(400).send('Profile not provided');
  }

  // if all, then get all profiles for customer
  let groups;
  if (req.params.profileObjId === 'all') {
    // get all customer profiles
    axios({
      method: 'get',
      url: `${process.env.SERVER_URL}/api/profiles/list`,
      headers: {
        Authorization: req.headers.authorization,
      },
    })
      .then(async (response) => {
        const profiles = response.data.results;
        groups = profiles.map((obj) => ObjectId(obj.group._id));
        const filterParams = {
          group: { $in: groups },
          date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          status: { $in: ['active', 'fulfilled'] },
        };

        const upcomingEvents = await Event.aggregate(
          [
            { $match: filterParams },
            ...eventPipeline,
            { $sort: { date: 1 } },
          ],
        );
        return res.send({
          totalCount: upcomingEvents.length,
          filteredCount: upcomingEvents.length,
          results: upcomingEvents,
        });
      })
      .catch((error) => res.status(400).send(error));
  } else {
    const profile = await Profile.findOne({ _id: req.params.profileObjId }).populate('subgroups');
    if (!profile) { return res.status(400).send('Profile not found'); }
    const { group } = profile.subgroups[0];

    const filterParams = {
      group: ObjectId(group),
      date: { $gt: new Date(new Date().setHours(0, 0, 0, 0)) },
      status: { $in: ['active', 'fulfilled'] },
    };
    const upcomingEvents = await Event.aggregate(
      [
        { $match: filterParams },
        ...eventPipeline,
        { $sort: { date: 1 } },
      ],
    );

    return res.send({
      totalCount: upcomingEvents.length,
      filteredCount: upcomingEvents.length,
      results: upcomingEvents,
    });
  }

  return false;
});

// **
// Get Event
// **
router.get('/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'group']), async (req, res) => {
  const storeSelect = res.user.role !== 'group' ? {
    _id: 1, storeName: 1, storeEmail: 1, storePhone: 1, stripeAccountId: 1, stripeAccountStatus: 1,
  } : {
    _id: 1, storeName: 1, storeEmail: 1, storePhone: 1,
  };

  const vendorSelect = res.user.role !== 'group' ? {
    _id: 1, companyName: 1, commission: 1,
  } : {
    _id: 1, companyName: 1,
  };

  // First check the user requesting
  const event = await Event.findOne({ _id: req.params.id })
    .populate({
      path: 'vendor',
      select: vendorSelect,
    })
    .populate({
      path: 'store',
      select: storeSelect,
    })
    .populate({
      path: 'group',
      select: {
        _id: 1, companyName: 1, address: 1, email: 1, firstName: 1, lastName: 1,
      },
      populate: {
        path: 'address',
      },
    })
    .populate({
      path: 'menus',
      select: {
        _id: 1, name: 1,
      },
    })
    .populate({
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1,
      },
    });

  // Finally get event orders
  const orders = await Order.find({ event: req.params.id })
    .populate({
      path: 'customer',
      select: {
        _id: 1, firstName: 1, lastName: 1, notes: 1, email: 1,
      },
    })
    .populate({
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1,
      },
    })
    .sort({ orderNumber: -1 });
  if (!event) { return res.status(400).send('No events found'); }
  const newObject = { ...event.toObject(), orders };
  return res.send(newObject);
});

// **
// Get Event v2
// **
router.get('/v2/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'group']), async (req, res) => {
  const event = await Event.aggregate(
    [
      { $match: { _id: ObjectId(req.params.id) } },
      {
        $lookup: {
          from: 'stores',
          let: {
            store: '$store',
          },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$store'] } } },
            {
              $project: {
                storeName: 1, storeEmail: 1, storePhone: 1, stripeAccountStatus: 1,
              },
            },
          ],
          as: 'store',
        },
      },
      { $unwind: { path: '$store' } },
      {
        $lookup: {
          from: 'users',
          let: {
            group: '$group',
          },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$group'] } } },
            {
              $project: {
                companyName: 1, email: 1, firstName: 1, lastName: 1,
              },
            },
          ],
          as: 'group',
        },
      },
      { $unwind: { path: '$group' } },
      {
        $addFields: {
          menus: { $ifNull: ['$menus', []] },
        },
      },
      {
        $lookup: {
          from: 'menus',
          let: { menus: '$menus' },
          pipeline: [
            { $match: { $expr: { $in: ['$_id', '$$menus'] } } },
            { $project: { name: 1 } },
          ],
          as: 'menus',
        },
      },
      {
        $lookup: {
          from: 'menus',
          let: {
            menuVendor: '$vendor',
          },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$$menuVendor', { $ifNull: ['$vendors', []] }] },
              },
            },
            { $limit: 1 },
            { $project: { name: 1 } },
          ],
          as: 'menuDefault',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { vendor: '$vendor' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$vendor'] } } },
            { $project: { companyName: 1 } },
          ],
          as: 'vendor',
        },
      },
      { $unwind: { path: '$vendor' } },
      {
        $lookup: {
          from: 'orders',
          let: { event_id: '$_id' },
          pipeline: [{ $match: { $expr: { $eq: ['$event', '$$event_id'] } } }],
          as: 'orders',
        },
      },

    ],
  );

  if (!event) { return res.status(400).send('No events found'); }

  return res.send(...event);
});

// **
// Get Event Menu(s)
// **
router.get('/menus/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'group']), async (req, res) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId).populate('menus');

  // 1. Check if on event, if so, return
  if (event.menus && event.menus.length > 0) {
    return res.send(event.menus.map((menu) => ({ _id: menu._id, name: menu.name, isDefault: false })));
  }

  // 2. If not on event, get from vendor on events
  const { vendor } = event;
  const vendorDefaultMenu = await Menu.findOne({ vendors: { $in: vendor } }).select('_id name');
  if (vendorDefaultMenu) {
    return res.send([{ _id: vendorDefaultMenu._id, name: vendorDefaultMenu.name, isDefault: true }]);
  }

  return res.status(204).send('No menus found');
});

// **
// Update Events
// **
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const updateValues = req.body;

  updateValues.date = moment.tz(updateValues.date, 'Australia/Sydney').format('YYYY-MM-DD');
  
  let savedEvent = await Event.findOneAndUpdate({ _id: req.params.id }, updateValues, {
    returnOriginal: false,
  });

  const deliveryDateTimeUTC = moment.tz(`${moment.tz(savedEvent.date, 'Australia/Sydney').format('MM/DD/YYYY')} ${savedEvent.deliveryTime}`, 'MM/DD/YYYY h:mm:ss A', savedEvent.timezone); // joins Date & Time and converts to UTC
  const cutoffDateTimeUTC = new Date(moment(deliveryDateTimeUTC).subtract(savedEvent.cutoffPeriod, 'hours')); // sub(deliveryDateTimeUTC, { hours: savedEvent.cutoffPeriod }); // new Date(moment(deliveryDateTimeUTC).subtract(savedEvent.cutoffPeriod, 'hours'));

  savedEvent = await Event.findOneAndUpdate({ _id: req.params.id },
    {
      deliveryDateTimeUTC,
      cutoffDateTimeUTC,
    }, {
      returnOriginal: false,
    });

  return res.send({ event: savedEvent, message: 'Event successfully updated' });
});

// **
// Update Event Status
// **
router.patch('/updateStatus/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'group']), async (req, res) => {
  const { ids, status } = req.body;
  const updatesEvents = await Event.updateMany(
    { _id: { $in: ids } },
    { $set: { status } },
    { multi: true },
  );
  return res.send({
    filteredCount: updatesEvents.length,
    results: updatesEvents,
  });
});

// **
// Fulfill Event
// **
router.post('/fulfillEvent/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['vendor', 'store']), async (req, res) => {
  const { ordersFulfilled } = req.body;
  const vendor = res.user._id;

  // get the orders to be fulfilled
  const orders = await Order.find({ _id: { $in: ordersFulfilled } }).select('orderTotals orderNumber');

  // Get the event
  const event = await axios({
    method: 'get',
    url: `${process.env.SERVER_URL}/api/events/${req.params.id}`,
    headers: {
      Authorization: req.headers.authorization,
    },
  })
    .then((response) => response.data)
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log('error: ', error);
      return res.status(400).send(error);
    });

  // Get Connected Account
  const { stripeAccountId } = event.store;

  // Get Commission
  const commission = event.vendor.commission ? (event.vendor.commission / 100) : (process.env.DEFAULT_COMMISSION / 100);

  // Build Payout Amount
  const fulFilledOrders = orders.map((order) => {
    const {
      orderSubtotal, orderTotal, orderFees, orderDonation,
    } = order.orderTotals[0];
    const commissionAmount = (commission * orderSubtotal);
    const donationAmount = orderDonation || 0;
    const payout = (orderSubtotal - donationAmount - commissionAmount);

    return {
      orderId: order._id,
      orderNumber: order.orderNumber,
      subtotalAmount: parseFloat(orderSubtotal),
      totalAmount: parseFloat(orderTotal),
      feesAmount: parseFloat(orderFees),
      commissionAmount: parseFloat(commissionAmount),
      donationAmount: parseFloat(donationAmount),
      payoutAmount: parseFloat(payout),
    };
  });

  const totalPayoutAmount = Math.round(fulFilledOrders.reduce((accumulator, object) => accumulator + object.payoutAmount, 0) * 100);

  try {
    // Create a transaction
    const transaction = await Transaction.create({
      type: 'payout',
      vendor,
      event: event._id,
      fulFilledOrders,
      payoutAmount: totalPayoutAmount,
      status: 'pending',
    });

    // first create a transfer
    const transfer = await stripe.transfers.create({
      amount: totalPayoutAmount,
      currency: 'aud',
      destination: stripeAccountId,
      transfer_group: event._id,
    });

    //   // console.log(transfer);

    // update the transaction
    await Transaction.updateOne({ _id: transaction._id }, {
      stripeReponse: transfer,
      status: 'transfer',
    });

    // create a payment
    const payout = await stripe.payouts.create({
      amount: totalPayoutAmount,
      currency: 'aud',
    }, {
      stripeAccount: stripeAccountId,
    });

    // update the transaction
    await Transaction.updateOne({ _id: transaction._id }, {
      stripeReponse: payout,
      status: 'completed',
    });

    // update the order event status
    await Event.updateOne({ _id: event._id }, {
      status: 'fulfilled',
    });

    // set orders to fulfilled
    await Order.updateMany(
      { _id: { $in: ordersFulfilled } },
      { $set: { status: 'fulfilled' } },
      { multi: true },
    );

    // refund all Pending transactions from the event
    const pendingOrders = event.orders.filter((x) => x.status === 'pending');
    if (pendingOrders.length > 0) {
      const promises = [];
      // eslint-disable-next-line no-restricted-syntax
      for (const element of pendingOrders) {
        const result = axios({
          method: 'post',
          url: `${process.env.SERVER_URL}/api/orders/cancel/${element._id}`,
          headers: {
            Authorization: req.headers.authorization,
          },
        })
          .catch((error) => {
          // eslint-disable-next-line no-console
            console.log('error: ', error);
            throw error;
          });
        promises.push(result);
      }
      await Promise.all(promises);
    }

    return res.send('Order event fulfilled');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error: ', error);
    return res.status(400).send(error);
  }
});

// **
// Update Event Status
// **
router.post('/eventNotification/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  // Get event
  await axios({
    method: 'get',
    url: `${process.env.SERVER_URL}/api/events/${req.params.id}`,
    headers: {
      Authorization: req.headers.authorization,
    },
  })
    .then(async (response) => {
      // notify admin
      emailTemplates.adminNotification.dynamic_template_data.subject = 'Order event has been fulfilled';
      emailTemplates.adminNotification.dynamic_template_data.email_title = 'Order event has been fulfilled';
      emailTemplates.adminNotification.dynamic_template_data.email_text = `${response.data.vendor.companyName} has just fulfilled and closed for ${response.data.group.companyName}. The event consisted of ${response.data.orders.length} orders`;
      emailTemplates.adminNotification.dynamic_template_data.btn_text = 'VIEW NOW';
      emailTemplates.adminNotification.dynamic_template_data.btn_url = `${process.env.FRONTEND_URL}/admin/order-dates/edit/${req.params.id}`;
      await sendEmail(
        [response.data.store.storeEmail],
        {
          ...emailTemplates.adminNotification,
        },
      );
    })
    .catch((error) => res.status(400).send(error));

  return res.send('Notification sent');
});

// **
// Temp: update delivery dates
// **
router.post('/updateDates/', verifyUser(['admin']), async (req, res) => {
  // loop all events
  const events = await Event.find();
  const promises = [];
  let i;
  // eslint-disable-next-line no-plusplus
  for (i = 0; i < events.length; i++) {
    promises.push(
      axios({
        method: 'patch',
        url: `${process.env.SERVER_URL}/api/events/update/${events[i]._id}`,
        headers: {
          Authorization: req.headers.authorization,
        },
      })
        .then((response) => response.data),
    );
  }
  return res.send(events);
});

module.exports = router;
