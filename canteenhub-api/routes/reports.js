/* eslint-disable no-nested-ternary */
/* eslint-disable no-await-in-loop */
const router = require('express').Router();
// const arraySort = require('array-sort');
const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');

// eslint-disable-next-line import/order
const ObjectId = require('mongodb').ObjectID;

// ** Models
const Order = require('../model/Order');
const Event = require('../model/Event');
const User = require('../model/User');

// ** utils
const { fetchStoreUserVendor, fetchStoreUserEvents } = require('../utils/storeFunctions');

// ** Report Order Summary
router.get('/orders/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'group']), async (req, res) => {
  // Get the parent vendor ID (if admin, then this must be provided)

  // eslint-disable-next-line no-nested-ternary
  const vendorFilter = res.user.role === 'store' ? { vendor: await fetchStoreUserVendor(res.user._id) } : res.user.role === 'vendor' ? { vendor: ObjectId(res.user._id) } : {};
  const eventFilter = res.user.role === 'store' ? { event: { $in: await fetchStoreUserEvents(res.user._id) } } : {};
  const groupFilter = res.user.role === 'group' ? { 'profile.0.group._id': res.user._id } : {};

  const orderSummary = await Order.aggregate(
    [
      {
        $match: {
          ...eventFilter,
          ...vendorFilter,
          ...groupFilter,
        },
      },
      {
        $project: {
          orderTotals: 1, status: 1, orderNumber: 1, createdAt: 1,
        },
      },
      { $unwind: { path: '$orderTotals' } },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          groupedDate: { $min: '$createdAt' },
          totalOrders: { $sum: 1 },
          totalTax: { $sum: { $round: ['$orderTotals.orderTax', 2] } },
          totalFees: { $sum: { $round: ['$orderTotals.orderFees', 2] } },
          totalAmount: { $sum: { $round: ['$orderTotals.orderTotal', 2] } },
        },
      },
      { $sort: { groupedDate: -1 } },
      {
        $facet: {
          monthlySummary: [
            { $match: { _id: { $exists: true } } },
            {
              $group: {
                _id: { month: '$_id.month', year: '$_id.year' },
                totalOrders: { $sum: '$totalOrders' },
                orderTax: { $sum: '$orderTax' },
                totalFees: { $sum: '$totalFees' },
                totalAmount: { $sum: '$totalAmount' },
              },
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
          ],
          dailySummary: [{ $match: { _id: { $exists: true } } }],
        },
      },
    ],
  );

  return res.send(orderSummary);
});

// ** Report Order Pick List
router.get('/orderPicklist/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  // Get the parent vendor ID (if admin, then this must be provided)

  // If Vendor, then find orders assizgned to the vendor
  // const customerFilter = res.user.role === 'customer' ? { customer: ObjectId(res.user._id) } : {};
  // const vendorFilter = res.user.role === 'vendor' ? { vendor: ObjectId(res.user._id) } : { vendor: ObjectId(req.query.vendor) };
  const vendorFilter = res.user.role === 'store' ? { vendor: await fetchStoreUserVendor(res.user._id) } : res.user.role === 'vendor' ? { vendor: ObjectId(res.user._id) } : req.query.vendor && req.query.vendor !== '' ? { vendor: ObjectId(req.query.vendor) } : {};
  const groupFilter = req.query.group !== '' ? { 'profile.group._id': req.query.group } : {};
  const statusFilter = req.query.status !== '' ? { status: req.query.status } : {};

  if (!req.query.dateRange) {
    return res.status(422).send('Please ensure a date range is provided');
  }

  const picklist = await Order.aggregate(
    [
      { $match: { ...vendorFilter, ...groupFilter, ...statusFilter } },
      { $project: { _id: 0, event: 1, orderLines: 1 } },
      {
        $lookup: {
          from: 'events',
          let: { event_id: '$event' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$event_id'] } } },
            { $project: { date: 1 } },
          ],
          as: 'event',
        },
      },
      {
        $match: {
          'event.date': {
            $gte: new Date(req.query.dateRange[0]),
            $lte: new Date(req.query.dateRange[1]),
          },
        },
      },
      { $unwind: { path: '$orderLines' } },
      {
        $facet: {
          items: [
            {
              $match: {
                orderLines: {
                  $exists: true,
                },
              },
            },
            {
              $group: {
                _id: {
                  item: '$orderLines.name',
                },
                qty: {
                  $sum: '$orderLines.qty',
                },
              },
            },
            {
              $addFields: {
                item: '$_id.item',
              },
            },
            {
              $unset: '_id',
            },
            { $sort: { item: 1 } },
          ],
          options: [
            {
              $match: {
                'orderLines.options': {
                  $exists: true,
                },
              },
            },
            { $project: { _id: 0, orderLines: 1 } },
            {
              $unwind: {
                path: '$orderLines.options',
              },
            },
            {
              $group: {
                _id: {
                  group: '$orderLines.options.optionGroupName',
                  option: '$orderLines.options.optionsSelected.name',
                },
                qty: {
                  $sum: '$orderLines.qty',
                },
              },
            },
            {
              $group: {
                _id: {
                  group: '$_id.group',
                },
                qty: {
                  $sum: '$qty',
                },
                options: {
                  $push: {
                    name: '$_id.option',
                    qty: {
                      $sum: '$qty',
                    },
                  },
                },
              },
            },
            {
              $addFields: {
                group: '$_id.group',
              },
            },
            {
              $unset: '_id',
            },
            {
              $sort: { group: 1 },
            },
          ],
        },
      },
    ],
  );

  return res.send(picklist);
});

// ** Report Payout Report
router.get('/payoutReport/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  // If Vendor, then find orders assizgned to the vendor
  
  // const customerFilter = res.user.role === 'customer' ? { customer: ObjectId(res.user._id) } : {};
  const vendorFilter = res.user.role === 'vendor' ? { vendor: ObjectId(res.user._id) } : req.query.vendor && req.query.vendor !== '' ? { vendor: ObjectId(req.query.vendor) } : {};
  const storeFilter = req.query.store && req.query.store !== '' ? { store: ObjectId(req.query.store) } : {};
  const groupFilter = req.query.group && req.query.group !== '' ? { group: ObjectId(req.query.group) } : {};

  if (!req.query.dateRange) {
    return res.status(422).send('Please ensure a date range is provided');
  }

  const payoutReportData = await Event.aggregate(
    [
      {
        $match: {
          ...vendorFilter,
          ...storeFilter,
          ...groupFilter,
          date: {
            $gte: new Date(req.query.dateRange[0]),
            $lte: new Date(req.query.dateRange[1]),
          },
        },
      },
      { $project: { title: 1, date: 1, status: 1 } },
      {
        $lookup: {
          from: 'orders',
          let: { event_id: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$event', '$$event_id'] } } },
            { $project: { orderNumber: 1, orderTotals: 1, status: 1 } },
            { $unwind: { path: '$orderTotals' } },
            {
              $group: {
                _id: '$status',
                count: { $count: {} },
                orderLinesSubtotal: { $sum: '$orderTotals.orderLinesSubtotal' },
                orderSubtotal: { $sum: '$orderTotals.orderSubtotal' },
                orderTax: { $sum: '$orderTotals.orderTax' },
                orderFees: { $sum: '$orderTotals.orderFees' },
                orderDiscount: { $sum: '$orderTotals.orderDiscount' },
                orderDonation: { $sum: '$orderTotals.orderDonation' },
                orderTotal: { $sum: '$orderTotals.orderTotal' },
              },
            },
          ],
          as: 'ordersSummary',
        },
      },
      {
        $lookup: {
          from: 'transactions',
          let: { event_id: '$_id' },
          pipeline: [
            { $match: { $expr: { $in: ['$$event_id', '$event'] } } },
            { $unwind: { path: '$stripeReponse' } },
            { $unwind: { path: '$stripeReponse' } },
            {
              $project: {
                payoutAmount: 1, status: 1, 'stripeReponse.id': 1, fulFilledOrders: 1,
              },
            },
            {
              $addFields: {
                totalAmount: { $sum: '$fulFilledOrders.totalAmount' },
                totalFees: { $sum: '$fulFilledOrders.feesAmount' },
                totalCommission: { $sum: '$fulFilledOrders.commissionAmount' },
                totalDonations: { $sum: '$fulFilledOrders.donationAmount' },
                totalPayout: { $sum: '$fulFilledOrders.payoutAmount' },
              },
            },
            { $project: { fulFilledOrders: 0 } },
          ],
          as: 'payoutSummary',
        },
      },
      { $unwind: { path: '$ordersSummary' } },
      { $addFields: { orderStatus: '$ordersSummary._id' } },
      {
        $facet: {
          // totals: [
          //   { $match: { _id: { $exists: true } } },
          //   { $group: { _id: null, count: { $sum: '$ordersSummary.count' } } },
          // ],
          fulfilled: [
            { $match: { orderStatus: 'fulfilled' } },
          ],
          active: [
            { $match: { orderStatus: 'active' } },
            { $project: { payoutSummary: 0 } },
          ],
          refunded: [
            { $match: { orderStatus: 'refunded' } },
            { $project: { payoutSummary: 0 } },
          ],
        },
      },
    ],
  );

  // console.log('payoutReportData', payoutReportData);

  return res.send(payoutReportData);
});

// ** Report Admin Stats
router.get('/adminStats/', verifyUser(['admin']), async (req, res) => {
  const adminStats = await User.aggregate(
    [
      {
        $facet: {
          all: [
            {
              $group: { _id: '$role', count: { $sum: 1 } },
            },
            {
              $sort: { count: -1 },
            },
          ],
          in_past_7_days: [
            {
              $match: { createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
            },
            {
              $group: { _id: '$role', count: { $sum: 1 } },
            },
            {
              $sort: { count: -1 },
            },
          ],
          in_past_30_days: [
            {
              $match: { createdAt: { $gt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } },
            },
            {
              $group: { _id: '$role', count: { $sum: 1 } },
            },
            {
              $sort: { count: -1 },
            },
          ],
        },
      },
    ],
  );

  return res.send(adminStats);
});

module.exports = router;
