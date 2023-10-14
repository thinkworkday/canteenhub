const stripe = require('stripe')(process.env.STRIPE_SEC_KEY);
const ObjectId = require('mongodb').ObjectID;

// ** Models
const Order = require('../model/Order');
const User = require('../model/User');

// ** utils
const {
  formatPrice, formatDate, isInThePastUTC, deliveryFormatDate,
} = require('./utils');

// ** SendGrid
const sendEmail = require('./sendGrid/sendEmail');
const { emailTemplates } = require('./sendGrid/emailTemplates');

// ** Build Order Data
const buildOrderData = async (currentOrder, paymentData) => {
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

      // Set status
      // const deliveryDate = getDeliveryDate(event.date, event.deliveryTime);
      // const cutoffDateRaw = getCutOffDate(new Date(deliveryDate), event.cutoffPeriod, false);
      // const isCutoff = !!isInThePastUTC(new Date(cutoffDateRaw));

      const { cutoffDateTimeUTC } = event;
      const isCutoff = !!isInThePastUTC(new Date(cutoffDateTimeUTC));

      const orderLinesSubtotal = orderLine.events[eventId].reduce((a, b) => a + b.qty * b.priceEach, 0);
      const orderFees = orderLinesSubtotal * (process.env.DEFAULT_TRANSACTION_FEE / 100);
      const orderLateFees = orderLinesSubtotal * (isCutoff ? process.env.DEFAULT_LATE_ORDER_FEE / 100 : 0);
      const orderSubtotal = orderLine.events[eventId].reduce((a, b) => a + b.subtotal, 0); // line items no fees
      const orderTax = orderSubtotal / 11; // line items no fees

      // calculate charity amount
      const charitySettings = event.vendor.vendorSettings && event.vendor.vendorSettings.charitySettings ? event.vendor.vendorSettings.charitySettings : {};
      let orderDonation = 0;
      if (charitySettings.active && charitySettings.charityAmount && charitySettings.charityAmount > 0) {
        orderDonation = orderSubtotal * (charitySettings.charityAmount / 100);
      }

      orderData.push({
        event,
        vendor: event.vendor,
        customer: currentOrder.customer,
        charitySettings,
        orderLines: orderLine.events[eventId],
        orderTotals: [
          {
            ...currentOrder.orderTotals[0],
            orderEvents: 1,
            orderLinesSubtotal,
            orderFees,
            orderLateFees,
            orderSubtotal,
            orderTax,
            orderDonation,
            orderTotal: orderSubtotal + orderFees + orderLateFees,
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
          late_fees: currentOrder.orderTotals[0].orderLateFees,
          transaction_total: currentOrder.orderTotals[0].orderTotal,
        },
        createdBy: currentOrder.customer,
        createdByModel: 'User',
      });
    }
  });

  return orderData;
};

// ** Create an order from cart data
// - orderDataAll: Object build using function buildOrderData()
const createOrdersFromCartOrder = async (orderDataAll) => {
  try {
    const createdOrders = [];
    let orderHTML = '';

    const orderDataArr = orderDataAll.map((orderData) => {
      const obj = orderData;
      delete (obj.orderLines[0].profile);
      delete (obj.orderLines[0].events);
      return ({ ...obj });
    });

    // eslint-disable-next-line no-restricted-syntax
    for await (const orderData of orderDataArr) {
      let orderCreated;
      try {
        orderCreated = await Order.create(orderData);
      } catch (err) {
        throw new Error(err);
      }

      createdOrders.push(orderCreated);

      // build html for email
      orderHTML += '<div>';
      if (orderData.status === 'pending') {
        orderHTML += `<h3>Order Number: ${orderCreated.orderNumber} (Pending)</h3>`;
        const vendorDetails = await User.findById(orderData.vendor).select('email firstName lastName companyName');
        // send email notification to vendor
        emailTemplates.blankTemplate.dynamic_template_data.subject = 'Pending order requires your approval';
        emailTemplates.blankTemplate.dynamic_template_data.email_text = 'A customer has ordered on one of your order dates after the cutoff period which requires your review. Pending orders need approval before they can be fulfilled.';
        emailTemplates.blankTemplate.dynamic_template_data.btn_text = 'View Pending Orders';
        emailTemplates.blankTemplate.dynamic_template_data.btn_url = `${process.env.FRONTEND_URL}/vendor/orders/list/?status=pending&upcoming=true`;
        await sendEmail([vendorDetails.email], {
          ...emailTemplates.blankTemplate,
        });
      } else {
        orderHTML += `<h3>Order Number: ${orderCreated.orderNumber}</h3>`;
      }
      orderHTML += `
          <div><strong>${orderCreated.profile[0].firstName} ${orderCreated.profile[0].lastName} - ${orderData.profile.group.companyName}</strong></div>
          <div><strong>${orderData.event.title} - ${deliveryFormatDate(orderData.event.date)} ${orderData.event.deliveryTime}</strong></div>
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
      transactionData,
    } = orderDataArr[0];

    // update payment description in Stripe
    await stripe.paymentIntents.update(transactionData.id, {
      description: `Canteen Hub Orders: ${orderNumbers}`,
      metadata: { orderCreated: true },
    });

    // send email notification to customer
    const customer = await User.findById(orderDataArr[0].customer).select('email');
    emailTemplates.orderNotifcation.dynamic_template_data.order_summary = orderHTML;
    emailTemplates.orderNotifcation.dynamic_template_data.order_fees = `${formatPrice(transactionData.transaction_fees)}`;
    if (transactionData.late_fees) {
      emailTemplates.orderNotifcation.dynamic_template_data.late_fees = `${formatPrice(transactionData.late_fees)}`;
    }
    emailTemplates.orderNotifcation.dynamic_template_data.order_total = `${formatPrice(transactionData.transaction_total)}`;
    await sendEmail([customer.email], {
      ...emailTemplates.orderNotifcation,
    });

    return ({ orders: createdOrders.map((obj) => `${obj._id}`), orderNumbers, message: 'Orders successfully created' });
  } catch (err) {
    throw new Error('database failed to connect');
  }
};

module.exports = {
  buildOrderData,
  createOrdersFromCartOrder,
};
