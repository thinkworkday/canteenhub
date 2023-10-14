/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
const router = require('express').Router();
const ObjectId = require('mongodb').ObjectID;
const axios = require('axios');

const stripe = require('stripe')(process.env.STRIPE_SEC_KEY);

const moment = require('moment');
const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const { ObjectID } = require('mongodb/node_modules/bson');
const verifyUser = require('../utils/verifyToken');
const testModeCheck = require('../utils/testMode');

// ** Models
const Order = require('../model/Order');
const User = require('../model/User');
const Transaction = require('../model/Transactions');
const MenuItem = require('../model/MenuItem');

// ** utils
const { fetchStoreUserEvents } = require('../utils/storeFunctions');
const { formatPrice, formatDate, getCutOffDate } = require('../utils/utils');

// ** SendGrid
const sendEmail = require('../utils/sendGrid/sendEmail');
const { emailTemplates } = require('../utils/sendGrid/emailTemplates');

// ** Create Order (DEPRECATED - use createOrdersFromCartOrder instead )
router.post('/create', verifyUser(['admin', 'customer']), async (req, res) => {
  const orderDataAll = req.body;
  // reset the counter
  const orderDataArr = orderDataAll.map((orderData) => ({
    ...orderData,
    // orderNumber,
    createdBy: res.user._id,
    createdByModel: res.user.role === 'admin' ? 'Administrator' : 'User',
  }));

  try {
    const createdOrders = [];

    let orderHTML = '';

    // eslint-disable-next-line no-restricted-syntax
    for await (const orderData of orderDataArr) {
      const orderCreated = await Order.create(orderData);
      createdOrders.push(orderCreated);

      // build html for email
      orderHTML += '<div>';

      if (orderData.status === 'pending') {
        orderHTML += `<h3>Order Number: ${orderCreated.orderNumber} (Pending)</h3>`;
        const vendorDetails = await User.findById(ObjectId(orderData.vendor)).select('email firstName lastName companyName');
        const data = {
          recipientEmail: vendorDetails.email,
          subject: 'Pending order requires your approval',
          content: 'A customer has ordered on one of your order dates after the cutoff period which requires your review. Pending orders need approval before they can be fulfilled.',
          btnText: 'View Pending Orders',
          btnUrl: `${process.env.FRONTEND_URL}/vendor/orders/list/?status=pending&upcoming=true`,
        };

        await axios.post(`${process.env.SERVER_URL}/api/notifications/sendNotification/`, data, {
          headers: {
            Authorization: req.headers.authorization,
          },
        }).catch((err) => {
          throw err;
        });
      } else {
        orderHTML += `<h3>Order Number: ${orderCreated.orderNumber}</h3>`;
      }

      orderHTML += `
        <div><strong>${orderCreated.profile[0].firstName} ${orderCreated.profile[0].lastName} - ${orderData.profile.group.companyName}</strong></div>
        <div><strong>${orderData.event.title} - ${formatDate(orderData.event.date)}</strong></div>
        `;

      if (orderData.status === 'pending') {
        orderHTML += '<div><strong class=\'text-primary\'>Order is pending and requires approval from admin</strong></div>';
      }

      orderHTML += `
        <div><h3>${formatPrice(orderCreated.orderTotals[0].orderTotal)}</h3></div>
        <hr />
      </div>`;
    }

    const orderNumbers = createdOrders.map((obj) => `${obj.orderNumber}`);
    const {
      transactionData, customer,
    } = orderDataArr[0];
    // update payment description in Stripe
    await stripe.paymentIntents.update(transactionData.id, {
      description: `Canteen Hub Orders: ${orderNumbers}`,
      metadata: { orderNumber: orderNumbers[0] },
    });

    // send email notification to customer
    emailTemplates.orderNotifcation.dynamic_template_data.order_summary = orderHTML;
    emailTemplates.orderNotifcation.dynamic_template_data.order_fees = `${formatPrice(transactionData.transaction_fees)}`;
    emailTemplates.orderNotifcation.dynamic_template_data.order_total = `${formatPrice(transactionData.transaction_total)}`;
    await sendEmail([customer.email], {
      ...emailTemplates.orderNotifcation,
    });

    return res.send({ createdOrders, message: 'Orders successfully created' });
  } catch (err) {
    return res.status(400).send(err);
  }
});

// Duplicated OrderNumber Check and Publish New OrderNumber
router.get('/duplicatedOrderNumbers/check', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin']), async (req, res) => {
  // Duplicated OrderNumbers Get
  const duplicatedOrderNumberList = await Order.aggregate([
    { $group: { _id: '$orderNumber', count: { $sum: 1 } } },
    { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    { $project: { orderNumber: '$_id', _id: 0 } },
  ]);
  // Update OrderNumber Wihth New Number
  for (const duplicateData of duplicatedOrderNumberList) {
    const orderFilterData = await Order.find({ orderNumber: duplicateData.orderNumber }).sort({ createdAt: -1 }).limit(1);
    const latestOrder = await Order.aggregate([
      { $sort: { orderNumber: -1 } },
    ], { allowDiskUse: true }).limit(1);

    const savedOrder = await Order.findOneAndUpdate(
      { _id: orderFilterData[0]._id },
      { $inc: { orderNumber: latestOrder[0].orderNumber - duplicateData.orderNumber + 1 } },
      { upsert: true, new: true },
    );

    // Set Manually Auto Increment For OrderNumber
    savedOrder.setNext('orderNumber', (err, orderNum) => {
      orderNum.orderNumber;
    });

    // update payment description in Stripe
    await stripe.paymentIntents.update(savedOrder.transactionData[0].id, {
      description: `Canteen Hub Orders: ${savedOrder.orderNumber}`,
      metadata: { orderCreated: true },
    });
  }

  return res.send({ duplicatedOrderNumberList });
});

// ** List Orders (All)
router.get('/list/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'customer', 'vendor', 'store', 'group']), async (req, res) => {
  // if store user - get events
  let storeUserEvents;
  if (res.user.role === 'store') {
    storeUserEvents = await fetchStoreUserEvents(res.user._id);
  }
  const eventFilter = res.user.role === 'store' ? { event: { $in: storeUserEvents } } : {};

  const orderNotesFilter = typeof req.query.orderNoteStatus !== 'undefined' && req.query.orderNoteStatus !== '' ? { status: req.query.orderNoteStatus, noteParent: null, createdByModel: 'User' } : {};

  // Get the parent vendor ID (if admin, then this must be provided)
  const statusFilter = typeof req.query.status !== 'undefined' && req.query.status !== ''
    ? { status: req.query.status }
    : { status: { $ne: 'deleted' } };

  // If Vendor, then find orders assizgned to the vendor
  const customerFilter = res.user.role === 'customer' ? { customer: ObjectId(res.user._id) } : {};
  const vendorFilter = res.user.role === 'vendor' ? { vendor: ObjectId(res.user._id) } : {};

  let groupFilter = {};
  if (res.user.role === 'group') {
    groupFilter = { 'profile.0.group._id': res.user._id };
  } else if (req.query.group) {
    groupFilter = { 'profile.0.group._id': req.query.group };
  }

  // Filter for Transaction ID (Stripe)
  const transactionIDFilter = typeof req.query.transactionDataID !== 'undefined' && req.query.transactionDataID !== '' ? { 'transactionData.id': req.query.transactionDataID } : {};

  const updatedFilter = typeof req.query.updated !== 'undefined'
    ? {
      updatedAt: {
        $gte: moment()
          .subtract({ minutes: req.query.updated })
          .toISOString(), // ISODate('2022-01-26T01:31:38.559+0000'),
      },
    }
    : {};

  const orderNumberFilter = typeof req.query.orderNumber !== 'undefined' && req.query.orderNumber
    ? { orderNumber: parseInt(req.query.orderNumber, 10) }
    : {};

  // Date ordered filter
  // const dateOrderedFilter = typeof req.query.dateRange !== 'undefined' && req.query.dateRange[0] ? { createdAt: { $gte: new Date(req.query.dateRange[0]), $lt: new Date(req.query.dateRange[1]) } } : {};

  // Date event filter
  let dateEventFilter;
  if (typeof req.query.dateRange !== 'undefined' && req.query.dateRange[0]) {
    dateEventFilter = {
      $match: {
        'event.deliveryDateTimeUTC': {
          $gte: new Date(req.query.dateRange[0]),
          $lte: new Date(req.query.dateRange[1]),
        },
      },
    };
  }

  let profileFirstNameFilter;
  if (typeof req.query.profileFirstName !== 'undefined' && req.query.profileFirstName) {
    profileFirstNameFilter = { 'profile.firstName': new RegExp(`.*${req.query.profileFirstName}.*`, 'i') };
  }

  let profileLastNameFilter;
  if (typeof req.query.profileLastName !== 'undefined' && req.query.profileLastName) {
    profileLastNameFilter = { 'profile.lastName': new RegExp(`.*${req.query.profileLastName}.*`, 'i') };
  }

  const isComing = !!(req.query && req.query.upcoming && req.query.upcoming === 'true');
  const upcomingFilter = isComing ? { $match: { 'event.deliveryDateTimeUTC': { $gt: new Date() } } } : {};

  try {
    const aggregateArray = [{
      $match: {
        ...updatedFilter,
        ...customerFilter,
        ...eventFilter,
        ...vendorFilter,
        ...groupFilter,
        ...statusFilter,
        ...orderNumberFilter,
        ...transactionIDFilter,
        ...profileFirstNameFilter,
        ...profileLastNameFilter,
      },
    },
    { $sort: { orderNumber: -1 } },
    { $limit: 5000 },
    {
      $lookup: {
        from: 'ordernotes',
        localField: '_id',
        foreignField: 'order',
        pipeline: [
          {
            $match: { ...orderNotesFilter },
          },
        ],
        as: 'orderNotes',
      },
    },
    {
      $project: {
        orderNumber: 1,
        customer: 1,
        event: 1,
        vendor: 1,
        profile: {
          firstName: 1,
          lastName: 1,
          notes: 1,
          allergies: 1,
          group: {
            companyName: 1,
            email: 1,
          },
          subgroups: {
            name: 1,
            type: 1,
          },
        },
        orderTotals: 1,
        status: 1,
        labelPrinted: 1,
        transactionData: 1,
        orderNotes: 1,
        createdBy: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
    {
      $lookup: {
        from: 'events',
        let: { event_id: '$event' },
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$event_id'] } } },
          {
            $project: {
              title: 1, store: 1, date: 1, deliveryTime: 1, cutoffPeriod: 1, deliveryDateTimeUTC: 1, cutoffDateTimeUTC: 1,
            },
          },
        ],
        as: 'event',
      },
    },
    {
      $unwind: { path: '$event' },
    },
    {
      $addFields: { eventDate: '$event.date' },
    }];

    if (dateEventFilter) {
      aggregateArray.push(dateEventFilter);
    }

    if (isComing) {
      aggregateArray.push(upcomingFilter);
    }

    aggregateArray.push(

      {
        $lookup: {
          from: 'stores',
          let: { store_id: '$event.store' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$store_id'] } },
            },
            {
              $project: { storeName: 1, storeEmail: 1 },
            },
          ],
          as: 'store',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { customer_id: '$customer' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$customer_id'] } },
            },
            {
              $project: {
                firstName: 1, lastName: 1, notes: 1, email: 1,
              },
            },
          ],
          as: 'customer',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { created_by_id: '$createdBy' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$created_by_id'] } } },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                notes: 1,
                email: 1,
              },
            },
          ],
          as: 'createdBy',
        },
      },
    );
    const orders = await Order.aggregate(aggregateArray);
    let ordersData;
    if (typeof req.query.orderNoteStatus !== 'undefined' && req.query.orderNoteStatus === 'pending') {
      ordersData = orders.map((order) => {
        if (order.orderNotes.length > 0) {
          return order;
        }
        return undefined;
      }).filter((order) => order !== undefined);
    } else {
      ordersData = orders;
    }

    return res.send({
      // totalCount,
      filteredCount: ordersData.length,
      results: ordersData,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`findOne error--> ${error}`);
    return error;
  }
});

// Get Order
router.get(
  '/:orderNumber', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']),
  verifyUser(['admin', 'customer', 'vendor', 'store', 'group']),
  async (req, res) => {
    // Ensure Vendor and Customer can only view their own orders
    const vendorFilter = res.user.role === 'vendor' ? { vendor: res.user._id } : {};
    const customerFilter = res.user.role === 'customer' ? { customer: res.user._id } : {};

    const filterParams = {
      $and: [
        // searchQuery,
        { orderNumber: req.params.orderNumber },
        vendorFilter,
        customerFilter,
      ],
    };

    const order = await Order.findOne(filterParams)
      .populate({
        path: 'event',
        populate: {
          path: 'store',
          select: {
            _id: 1,
            storeName: 1,
            storeEmail: 1,
            storePhone: 1,
            storeLogo: 1,
            storeAddress: 1,
          },
          populate: {
            path: 'storeAddress',
          },
        },
      })
      .populate({
        path: 'customer',
        select: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          notes: 1,
          email: 1,
        },
      })
      .populate({
        path: 'createdBy',
        select: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          role: 1,
        },
      });

    if (!order) {
      return res.status(400).send('No order found');
    }

    // if customer, double check they can see this record
    if (
      res.user.role === 'customer'
      && res.user._id !== String(order.customer._id)
    ) {
      return res
        .status(400)
        .send('You do not have permission to view this order');
    }

    // if (menu.status === 'deleted') {
    //   return res.status(400).send('Menu was previously created however is now deleted');
    // }
    return res.send(order);
  },
);

// Update Orders
router.patch('/update/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'customer']), async (req, res) => {
  const updateValues = req.body;
  const savedOrder = await Order.findOneAndUpdate(
    { _id: req.params.id },
    updateValues,
    {
      new: true,
    },
  );

  return res.send({
    order: savedOrder,
    message: 'Order successfully updated',
  });
});

// Cancel Order
router.post('/cancel/:id', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store', 'customer']), async (req, res) => {
  const { id } = req.params;

  // Get the order
  const order = await Order.findById(id);

  if (res.user.role === 'customer' && res.user._id !== order.customer.toString()) {
    return res.status(400).send('permission error: access denied');
  }

  const paymentIntent = order.transactionData[0] ? order.transactionData[0].id : null;
  if (!paymentIntent) { return res.status(400).send('payment transaction not found - refund failed'); }

  try {
    const refundAmount = parseInt(order.orderTotals[0].orderLinesSubtotal * 100, 10);

    // Apply the refund
    await stripe.refunds.create({
      payment_intent: paymentIntent,
      metadata: {
        orderNumber: String(order.orderNumber),
      },
      amount: refundAmount,
    });

    await Order.updateOne(
      { _id: id },
      { $set: { status: 'refunded' } },
    );

    // get the customer details
    const customer = await User.findById(order.customer).select('firstName lastName email');

    // Create a transaction
    await Transaction.create({
      type: 'refund',
      fulFilledOrders: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        payoutAmount: 0,
        commissionAmount: 0,
        totalAmount: (refundAmount / 100),
      },
      payoutAmount: (refundAmount / 100),
      status: 'completed',
    });

    // send email notification
    emailTemplates.adminNotification.dynamic_template_data.subject = 'Order has been cancelled and refunded';
    emailTemplates.adminNotification.dynamic_template_data.email_title = 'Order has been cancelled and refunded';
    emailTemplates.adminNotification.dynamic_template_data.email_text = `Order #${String(order.orderNumber)} has just been cancelled and refunded. The total amount refunded into your assigned payment method was ${formatPrice(order.orderTotals[0].orderLinesSubtotal)}`;
    await sendEmail(
      [customer.email],
      {
        ...emailTemplates.adminNotification,
      },
    );

    return res.send(order);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`findOne error--> ${error}`);
    return res.status(400).send(error);
  }
});

// Update Order Status
router.patch('/updateStatus/', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const { ids, status } = req.body;
  const updatesOrders = await Order.updateMany(
    { _id: { $in: ids } },
    { $set: { status } },
    { multi: true },
  );

  return res.send({
    filteredCount: updatesOrders.length,
    results: updatesOrders,
  });
});

// Print Label
router.post('/printLabels', testModeCheck(['vendor', 'group', 'store', 'school', 'customer']), verifyUser(['admin', 'vendor', 'store']), async (req, res) => {
  const { orderIds } = req.body;

  const doc = new PDFDocument({ size: 'A6', margin: 0 });
  // const filename = `order-label-${orderId}.pdf`;

  const baseFontSize = 15;

  function addHorizontalRule(
    // eslint-disable-next-line no-shadow
    doc,
    spaceFromEdge = 0,
    linesAboveAndBelow = 0.1,
  ) {
    doc.moveDown(linesAboveAndBelow);
    doc
      .moveTo(0 + spaceFromEdge, doc.y)
      .lineTo(doc.page.width - spaceFromEdge, doc.y)
      .stroke('#eee');
    doc.moveDown(linesAboveAndBelow);
    return doc;
  }

  function printOptions(lineOptions) {
    if (lineOptions) {
      doc.fillColor('black');
      const optionSelectedString = lineOptions.optionsSelected.map(
        (option) => option.name,
      );
      doc.moveDown(0.1);
      doc
        .fillColor('black')
        .fontSize(baseFontSize - 2)
        .font('Helvetica-Bold')
        .text(
          `${lineOptions.optionGroupName}: `,
          {
            continued: true,
            indent: 15,
          },
        )
        .fillColor('black')
        .fontSize(baseFontSize - 2)
        .font('Helvetica')
        .text(`${optionSelectedString.join(', ')}`, 36, doc.y, {
          continued: false,
        });
    }
  }

  async function printOrderLines(orderLine) {
    // Get MenuItem
    const defaultMenuItem = await MenuItem.findById(orderLine._id);

    doc.fillColor('black');
    doc.font('Helvetica-Bold');
    doc.fontSize(baseFontSize).text(`${orderLine.qty}x ${orderLine.name}`, 20);
    doc.font('Helvetica');

    const defaultOrderLineOptions = defaultMenuItem.options;
    const lookupTable = {};
    orderLine.options.forEach((object, index) => {
      lookupTable[object.optionId] = index;
    });
    const orderedOrderLine = defaultOrderLineOptions.map((id) => orderLine.options[lookupTable[id]]);
    orderedOrderLine.forEach(printOptions);
    doc.moveDown(1);
  }
  const orderDataIds = orderIds.map((orderId) => ObjectId(orderId));
  // Get the order
  const orders = await Order.aggregate(
    [
      {
        $match: {
          _id: { $in: orderDataIds },
        },
      },
      {
        $lookup: {
          from: 'events',
          let: { event_id: '$event' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$event_id'] } } },
            {
              $project: {
                title: 1, store: 1, date: 1, deliveryTime: 1, cutoffPeriod: 1, deliveryDateTimeUTC: 1, cutoffDateTimeUTC: 1,
              },
            },
          ],
          as: 'event',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { customer_id: '$customer' },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$_id', '$$customer_id'] } },
            },
            {
              $project: {
                firstName: 1, lastName: 1, notes: 1, email: 1,
              },
            },
          ],
          as: 'customer',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { created_by_id: '$createdBy' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$created_by_id'] } } },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                notes: 1,
                email: 1,
              },
            },
          ],
          as: 'createdBy',
        },
      },
      {
        $lookup: {
          from: 'ordernotes',
          let: { orderId: '$_id' },
          pipeline: [
            {
              $match: {
                noteParent: { $exists: false },
                $expr: {
                  $and: [
                    { $eq: ['$order', '$$orderId'] },
                  ],
                },
              },
            },
          ],
          as: 'ordernotes',
        },
      },
    ],
  );

  if (!orders) {
    return res.status(400).send('No order found');
  }

  // Stripping special characters
  // filename = `${encodeURIComponent(filename)}.pdf`;
  // Setting response to 'attachment' (download).
  // If you use 'inline' here it will automatically open the PDF
  // res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-type', 'application/pdf');
  let index = 0;
  for (const order of orders) {
    const { date } = order.event[0];
    const profile = order.profile[0];
    const { orderLines } = order;
    const orderNotes = order.ordernotes;

    // New Page (not for first)
    if (index > 0) {
      doc.addPage();
    }

    // Order Number
    doc.font('Helvetica-Bold');
    doc.fontSize(baseFontSize).text(`Order #${order.orderNumber}`, 20, 20);
    doc.font('Helvetica');

    // Logo
    doc.image('./assets/canteen-hub-logo.png', 220, 15, { width: 60 });
    addHorizontalRule(doc, 20, 1);

    doc.moveDown(0.25);
    doc.fontSize(baseFontSize - 2).text(moment(date).format('Do MMM YYYY'), 20);

    doc.fontSize(baseFontSize - 2)
      .text(`${profile.firstName} ${profile.lastName}`, 20)
      .fontSize(baseFontSize - 2)
      .text(`${profile.group.companyName} (${profile.subgroups[0].name})`);
    doc.moveDown(0.25);

    if (profile.allergies.length > 0) {
      doc
        .fillColor('red')
        .fontSize(baseFontSize - 1)
        .text(`Allergies: ${profile.allergies.join(', ')} `, 20);
    }

    if (profile.notes.length > 0) {
      doc.moveDown(0.2);
      doc
        .fillColor('black')
        .fontSize(baseFontSize - 3)
        .text(`Notes: ${profile.notes} `, 20);
    }

    if (orderNotes.length > 0) {
      doc.moveDown(0.2);
      doc
        .fillColor('red')
        .fontSize(baseFontSize - 1)
        .text('Modification(s)', 20);
      doc.moveDown(0.2);
      for (const orderNote of orderNotes) {
        if (orderNote.status == 'approved') {
          doc
            .fillColor('black')
            .fontSize(baseFontSize - 3)
            .text(`${orderNote.notes} `, 20);
          // doc
          //   .fillColor('black')
          //   .fontSize(baseFontSize - 3)
          //   .text(`CreatedBy: ${orderNote.createdBy.firstName} ${orderNote.createdBy.lastName} ${orderNoteCutOffDate}`, 20);
          // orderNote.replies.map((reply, i) => {
          //   const replyCutOffDate = getCutOffDate(orderNote.createdAt, 0, true);
          //   doc
          //     .fillColor('black')
          //     .fontSize(baseFontSize - 3)
          //     .text(`${reply.status} by ${reply.createdBy.firstName} ${reply.createdBy.lastName} ${replyCutOffDate}`, 20);
          // });
        }
      }
    }

    doc.moveDown(0.25);
    addHorizontalRule(doc, 20, 1);
    doc.moveDown(0.25);
    for (const orderLine of orderLines) {
      await printOrderLines(orderLine);
    }

    // update the labelPrinted status to true
    await Order.findOneAndUpdate({ _id: order._id }, { labelPrinted: true });
    index++;
  }

  doc.pipe(res);
  doc.end();
});

// Temp: Update Order Fees
router.patch('/updateOrderFees', verifyUser(['admin']), async (req, res) => {
  // Get all orders
  const orders = await Order.aggregate(
    [
      // {
      //   $match: {
      //     _id: ObjectId('628f8250ab9cc491640f2877'),
      //   },
      // },
      { $project: { orderTotals: 1, transactionData: 1, orderNumber: 1 } },
      {
        $lookup: {
          from: 'orders',
          let: { payment_intent: '$transactionData.id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$transactionData.id', '$$payment_intent'] } } },
            { $project: { orderTotals: 1 } },
            { $unwind: { path: '$orderTotals' } },
            {
              $group: {
                _id: null,
                count: { $count: {} },
                orderSubtotal: { $sum: '$orderTotals.orderSubtotal' },
              },
            },
          ],
          as: 'transaction',
        },
      },
      {
        $unwind: { path: '$transaction' },
      },
      {
        $addFields: {
          'transactionData.order_count': '$transaction.count',
          'transactionData.transaction_fees': {
            $add: [0.3, { $multiply: ['$transaction.orderSubtotal', 0.0175] }],
          },
          'transactionData.transaction_subtotal': '$transaction.orderSubtotal',
          'transactionData.transaction_total': {
            $add: ['$transaction.orderSubtotal', 0.3, { $multiply: ['$transaction.orderSubtotal', 0.0175] }],
          },
        },
      },
      {
        $unwind: { path: '$orderTotals' },
      },
      {
        $addFields: {
          'orderTotals.orderFees': {
            $multiply: ['$orderTotals.orderSubtotal', 0.025],
          },
          'orderTotals.orderTax': {
            $divide: ['$orderTotals.orderSubtotal', 11.0],
          },
          'orderTotals.orderTotal': {
            $add: [
              {
                $multiply: ['$orderTotals.orderSubtotal', 0.025],
              },
              '$orderTotals.orderSubtotal',
            ],
          },
        },
      },
      {
        $project: {
          orderNumber: 0,
          transaction: 0,
        },
      },
    ],
  );

  const updateOrderTransactionData = async (orderData) => {
    if (orderData) {
      const orderTotals = [orderData.orderTotals];
      await Order.updateOne({ _id: orderData._id }, {
        orderTotals,
        transactionData: orderData.transactionData,
      });
    }
    return (null);
  };

  // eslint-disable-next-line no-restricted-syntax
  for (const orderData of orders) {
    updateOrderTransactionData(orderData);
  }

  return res.send({
    orders,
    message: 'Order successfully updated',
  });
});

// OrderNotes Pending  List
router.get('/orderNotes/pendingList', verifyUser(['admin', 'vendor']), async (req, res) => {
  const vendorFilter = res.user.role === 'vendor' ? { vendor: ObjectId(res.user._id) } : {};
  try {
    const orders = await Order.aggregate([
      {
        $match: {
          ...vendorFilter,
        },
      },
      {
        $lookup: {
          from: 'ordernotes',
          localField: '_id',
          foreignField: 'order',
          pipeline: [
            {
              $match: { status: 'pending', noteParent: null, createdByModel: 'User' },
            },
          ],
          as: 'orderNotes',
        },
      },
    ]);
    const ordersData = orders.map((order) => {
      if (order.orderNotes.length > 0) {
        return order;
      }
      return undefined;
    }).filter((order) => order !== undefined);

    return res.send({
      // totalCount,
      totalCount: ordersData.length,
      results: ordersData,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`findOne error--> ${error}`);
    return error;
  }
});

module.exports = router;
