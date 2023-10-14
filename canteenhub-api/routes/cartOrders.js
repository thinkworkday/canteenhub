const router = require('express').Router();

// const { isValidObjectId } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
// const ObjectId = require('mongodb').ObjectID;

const moment = require('moment');
const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');
// const { canIAccessRecord } = require('../utils/utils');

// ** Models
const CartOrder = require('../model/CartOrders');
const Menu = require('../model/Menu');

// ** SendGrid
// const sendEmail = require('../utils/sendGrid/sendEmail');
// const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

// ** Create Cart Order
router.post('/create', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'customer']), async (req, res) => {
  const orderData = req.body;
  orderData.createdBy = res.user._id;
  orderData.createdByModel = (res.user.role === 'admin' ? 'Administrator' : 'User');

  // // validate request
  // const { error } = menuValidation(menuData);
  // if (error) { return res.status(400).send(error.details[0].message); }
  const order = new CartOrder(orderData);
  try {
    const savedOrder = await order.save();
    return res.send({ order: savedOrder, message: 'Cart order successfully created' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// ** List Cart Orders (All)
router.get('/list/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'customer']), async (req, res) => {
  const customerFilter = res.user.role === 'customer' ? { createdBy: res.user._id } : {};
  const statusFilter = typeof req.query.status !== 'undefined' ? { status: req.query.status } : { status: { $ne: 'expired' } };
  const createdFilter = typeof req.query.created !== 'undefined' ? {
    createdAt: {
      $gte: moment().subtract({ minutes: req.query.created }).toISOString(), // ISODate('2022-01-26T01:31:38.559+0000'),
    },
  } : {};
  const updatedFilter = typeof req.query.updated !== 'undefined' ? {
    createdAt: {
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
      customerFilter,
      createdFilter,
      updatedFilter,
      statusFilter,
    ],
  };

  // const totalCount = await Order.countDocuments(filterParams);
  const orders = await CartOrder.find(filterParams)
    .populate({
      path: 'events',
      // select: {
      //   _id: 1, firstName: 1, lastName: 1, role: 1,
      // },
    })
    .populate({
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1,
      },
    });

  // check for old events, if present, then expire cart order
  const ordersFilteredData = await Promise.all(orders.map((order) => {
    if (order.events && order.events.length > 0) {
      const expiredEvents = order.events.map((event) => (moment(event.date).isBefore() ? event : null)).filter((x) => x != null);
      if (expiredEvents && expiredEvents.length > 0) {
        CartOrder.findOneAndUpdate({ _id: orders[0]._id }, { status: 'expired' }, {
          new: true,
        });
      } else {
        return order;
      }
    }
    return null;
  }));
  const ordersFiltered = ordersFilteredData.filter((x) => x != null);
  
  return res.send({
    // totalCount,
    // filteredCount: orders.length,
    results: ordersFiltered,
  });
});

// Get Cart Order
router.get('/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'customer']), async (req, res) => {
  // First check the user requesting (Only Vendors and Admin allowed)
  const order = await CartOrder.findOne({ _id: req.params.id })
    .populate({
      path: 'profile',
    })
    .populate({
      path: 'profile',
      populate: {
        path: 'group',
        select: {
          _id: 1, companyName: 1, firstName: 1, lastName: 1, email: 1, address: 1,
        },
        populate: {
          path: 'address',
        },
      },
    })
    .populate({
      path: 'profile',
      populate: {
        path: 'subgroups',
      },
    })
    .populate({
      path: 'customer',
      select: {
        _id: 1, firstName: 1, lastName: 1, email: 1, stripeCustomerId: 1,
      },
    })
    .populate({
      path: 'events',
      select: {
        _id: 1, title: 1, status: 1, date: 1, deliveryTime: 1, cutoffPeriod: 1, vendor: 1, store: 1, menus: 1, deliveryDateTimeUTC: 1, cutoffDateTimeUTC: 1,
      },
      populate: [{
        path: 'store',
        select: {
          storeName: 1,
        },
      }, {
        path: 'vendor',
        select: {
          _id: 1, companyName: 1, vendorSettings: 1,
        },
      }],
    })
    .populate({
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1, email: 1,
      },
    });

  if (!order) { return res.status(400).send('No order found'); }
  if ((res.user.role === 'customer') && (res.user._id !== String(order.customer._id))) {
    return res.status(400).send('You do not have permission to view this order');
  }

  // finally get the Vendor default menu(s) for each vendor
  const eventDefaultMenus = await Promise.all(order.events.map(async (event) => {
    const vendorDefaultMenu = await Menu.findOne({ vendors: { $in: event.vendor } }).select('_id name');
    return { vendor: event.vendor, name: vendorDefaultMenu.name, _id: vendorDefaultMenu._id };
  }));

  return res.send({ ...order._doc, defaultMenus: eventDefaultMenus });
});

// Update Cart Orders
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'customer']), async (req, res) => {
  const updateValues = req.body;

  await CartOrder.findOneAndUpdate({ _id: req.params.id, customer: res.user._id }, updateValues, {
    new: true,
  });

  const order = await CartOrder.findOne({ _id: req.params.id })
    .populate({
      path: 'profile',
    })
    .populate({
      path: 'profile',
      populate: {
        path: 'group',
        select: {
          _id: 1, companyName: 1, firstName: 1, lastName: 1, email: 1, address: 1,
        },
        populate: {
          path: 'address',
        },
      },
    })
    .populate({
      path: 'profile',
      populate: {
        path: 'subgroups',
      },
    })
    .populate({
      path: 'customer',
      select: {
        _id: 1, firstName: 1, lastName: 1, email: 1, stripeCustomerId: 1,
      },
    })
    .populate({
      path: 'events',
      select: {
        _id: 1, title: 1, status: 1, date: 1, deliveryTime: 1, cutoffPeriod: 1, vendor: 1, store: 1, menus: 1, deliveryDateTimeUTC: 1, cutoffDateTimeUTC: 1,
      },
      populate: [{
        path: 'store',
        select: {
          storeName: 1,
        },
      }, {
        path: 'vendor',
        select: {
          _id: 1, companyName: 1, vendorSettings: 1,
        },
      }],
    })
    .populate({
      path: 'currentMenu',
    })
    .populate({
      path: 'createdBy',
      select: {
        _id: 1, firstName: 1, lastName: 1, role: 1, email: 1,
      },
    });

  // finally get the Vendor default menu(s) for each vendor
  const eventDefaultMenus = await Promise.all(order.events.map(async (event) => {
    const vendorDefaultMenu = await Menu.findOne({ vendors: { $in: event.vendor } }).select('_id name');
    return { vendor: event.vendor, name: vendorDefaultMenu.name, _id: vendorDefaultMenu._id };
  }));

  return res.send({ order: { ...order._doc, defaultMenus: eventDefaultMenus }, message: 'Cart order successfully updated' });
});

// Delete Cart Order
router.delete('/delete/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'customer']), async (req, res) => {
  // don't allow to delete self
  if (res.user._id === req.params.id) {
    return res.status(400).send('Cannot delete self');
  }

  let hasPermission = false;
  if (res.user.role === 'customer') {
    const cartOrder = await CartOrder.findOne({ _id: req.params.id, createdBy: res.user._id });
    if (cartOrder) {
      hasPermission = true;
    }
  }
  if (res.user.role === 'admin') {
    hasPermission = true;
  }

  if (!hasPermission) {
    return res.status(400).send('permission error: cannot access');
  }

  // delete cartOrder
  try {
    await CartOrder.findByIdAndDelete(req.params.id);
    return res.send('cart cleared');
  } catch (e) {
    return res.status(400).send(e.message);
  }
});

module.exports = router;
