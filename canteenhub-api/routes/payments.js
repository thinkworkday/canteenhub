/* eslint-disable no-case-declarations */
/* eslint-disable import/order */
const router = require('express').Router();
// const express = require('express');
// const { isValidObjectId } = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const ObjectId = require('mongodb').ObjectID;

const verifyUser = require('../utils/verifyToken');

const stripe = require('stripe')(process.env.STRIPE_SEC_KEY);

const User = require('../model/User');
const Transaction = require('../model/Transactions');
const Order = require('../model/Order');

const createNewCustomer = async (customerData) => {
  const stripeCustomer = await stripe.customers.create({
    name: `${customerData.firstName} ${customerData.lastName}`,
    email: customerData.email,
  });

  // Update the record in the database
  await User.findOneAndUpdate({ _id: customerData._id }, { stripeCustomerId: stripeCustomer.id }, {
    new: true,
  });

  return stripeCustomer.id;
};

// ** Stripe Create Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  const {
    amount, customer, cartId, currency,
  } = req.body;

  try {
    // 1st Check for payment methods - if stored, then don't create payment Intent
    let paymentMethods;
    try {
      paymentMethods = await stripe.paymentMethods.list({
        customer: `${customer.stripeCustomerId}`,
        type: 'card',
      });
    } catch {
      // no payment methods (continue with payment intent)
    }

    // ** Create Stripe Customer
    // - check if customer already added so we don't create duplicates
    // - this will add a customer everytime checkout is accessed if no payment methods attached
    let stripeCustomerId = '';
    if (!customer.stripeCustomerId) {
      stripeCustomerId = await createNewCustomer(customer);
    } else {
      // make sure the customer exists (otherwise payment will not be created)
      let stripeCustomer;
      try {
        stripeCustomer = await stripe.customers.retrieve(
          customer.stripeCustomerId,
        );
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
      if (!stripeCustomer || stripeCustomer.deleted) {
        stripeCustomerId = await createNewCustomer(customer);
      } else {
        stripeCustomerId = customer.stripeCustomerId;
      }
    }

    // if (amount > 100) {
    const paymentIntent = await stripe.paymentIntents.create({
      customer: stripeCustomerId,
      setup_future_usage: 'off_session',
      amount,
      currency,
      automatic_payment_methods: {
        enabled: false,
      },
      description: `Order Id: ${cartId}`,
    });
    res.send({
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
      customerId: paymentIntent.customer,
      paymentMethods,
    });
    // }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
    res.send({ error: 'error' });
  }
});

router.post('/reuse-payment-intent', async (req, res) => {
  const {
    customerStripeId, paymentMethodIndex, stripePaymentIntent,
  } = req.body;
  try {
    // check again for failsafe measure
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerStripeId,
      type: 'card',
    });

    const paymentIntentId = stripePaymentIntent[0].paymentIntentId ? stripePaymentIntent[0].paymentIntentId : stripePaymentIntent[0].clientSecret.substr(0, stripePaymentIntent[0].clientSecret.indexOf('_secret'));

    // Update the payment intent (with correct total)
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      { payment_method: paymentMethods.data[paymentMethodIndex].id },
    );

    res.send({
      success: 'success',
      paymentIntent,
      clientSecret: stripePaymentIntent[0].clientSecret,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('Error reusing payment intent', err.message);
    // // Error code will be authentication_required if authentication is needed
    // const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
    // res.send({
    //   success: 'success',
    //   paymentIntent: paymentIntentRetrieved,
    //   clientSecret: paymentIntentRetrieved.client_secret,
    // });
    return res.send({
      success: 'failed',
      message: err.message,
    });
  }
});

// ** RetrievePayment Intent
router.get('/retrieve-payment-intent', async (req, res) => {
  const {
    paymentIntentId,
  } = req.query;

  if (!paymentIntentId) {
    return res.status(400).send('payment intent not found');
  }

  // const paymentIntent = 'hello workld';
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId,
    );
    res.send({
      paymentIntent,
    });
    // }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
    res.send({ error: 'error' });
  }

  return false;
});

// ** Update Payment Intent
router.post('/update-payment-intent', async (req, res) => {
  const {
    paymentIntentId, amount,
  } = req.body;

  if (!paymentIntentId) {
    return res.status(400).send('payment intent not found');
  }

  try {
    // Update the payment intent (with correct total)
    const paymentIntent = await stripe.paymentIntents.update(paymentIntentId, { amount });
    res.send({
      paymentIntent,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
    res.send({ error: 'error' });
  }

  return false;
});

// ** RetrievePayment Methods
router.get('/retrieve-payment-methods', async (req, res) => {
  const { clientId } = req.query;
  if (!clientId) { return res.status(400).send('payment methods not found'); }

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: clientId,
      type: 'card',
    });

    res.send({
      paymentMethods,
    });
    // }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('error', error);
    res.send({ error: 'error' });
  }

  return false;
});

// // ** Payment Intent - Webhook Handler
// const endpointSecret = 'whsec_01795d3f446143f28486e08b9266463682afbe06a3c4640c4eadb9fb39db749f'; // This is your Stripe CLI webhook secret for testing your endpoint locally.
// router.post('/webhook/payment-intent-handler', express.raw({ type: 'application/json' }), (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   console.log('webhook received', sig);
//   console.log('req.body', req.rawBody);
//   // let event;
//   // try {
//   //   console.log('START TRY');
//   //   event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   //   console.log('END TRY');
//   // } catch (err) {
//   //   console.log(err);
//   //   res.status(400).send(`Webhook Error: ${err.message}`);
//   //   return;
//   // }

//   // console.log('event.type', event);

//   // // Handle the event
//   // switch (event.type) {
//   //   case 'payment_intent.succeeded':
//   //     const paymentIntent = event.data.object;

//   //     console.log('paymentIntent', paymentIntent);
//   //     // Then define and call a function to handle the event payment_intent.succeeded
//   //     break;
//   //   // ... handle other event types
//   //   default:
//   //     console.log(`Unhandled event type ${event.type}`);
//   // }

//   return false;
// });

// ** Stripe List Payment Methods
// router.post('/listPaymentMethods', verifyUser(['customer']), async (req, res) => {
//   const {
//     amount, customer, cartId,
//   } = req.body;

//   try {
//     console.log('stripeCustomerId', customer.stripeCustomerId);
//     // 1st Check for payment methods - if stored, then don't create payment Intent
//     // let paymentMethods;
//     // try {
//     //   paymentMethods = await stripe.paymentMethods.list({
//     //     customer: `${customer.stripeCustomerId}`,
//     //     type: 'card',
//     //   });
//     // } catch {
//     //   // no payment methods (continue with payment intent)
//     // }

//     // ** Create Stripe Customer
//     // - check if customer already added so we don't create duplicates
//     // - this will add a customer everytime checkout is accessed if no payment methods attached
//     let stripeCustomerId = '';
//     if (!customer.stripeCustomerId) {
//       stripeCustomerId = await createNewCustomer(customer);
//     } else {
//       // make sure the customer exists (otherwise payment will not be created)
//       let stripeCustomer;
//       try {
//         stripeCustomer = await stripe.customers.retrieve(
//           customer.stripeCustomerId,
//         );
//       } catch (e) {
//         // eslint-disable-next-line no-console
//         console.log(e);
//       }
//       if (!stripeCustomer || stripeCustomer.deleted) {
//         stripeCustomerId = await createNewCustomer(customer);
//       } else {
//         stripeCustomerId = customer.stripeCustomerId;
//       }
//     }

//     // if (amount > 100) {
//     const paymentIntent = await stripe.paymentIntents.create({
//       customer: stripeCustomerId,
//       setup_future_usage: 'off_session',
//       amount: 100, // create payment intent with 1 cent to start
//       currency: 'aud',
//       automatic_payment_methods: {
//         enabled: true,
//       },
//       description: `Order Id: ${cartId}`,
//     });
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//       customerId: paymentIntent.customer,
//       // paymentMethods,
//     });
//     // }
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.log('error', error);
//     res.send({ error: 'error' });
//   }
// });

// ** List Payment Transactions (Customer Orders)
router.get('/customer/transactions/list/', verifyUser(['admin', 'customer']), async (req, res) => {
  // Get the parent vendor ID (if admin, then this must be provided)
  const customerFilter = res.user.role === 'customer' ? { customer: ObjectId(res.user._id) } : {};

  const filterParams = {
    $and: [
      // customerFilter,
      customerFilter,
      // updatedFilter,
      // statusFilter,
    ],
  };

  const totalCount = await Order.countDocuments(filterParams);
  const transactions = await Order.aggregate(
    [
      { $match: customerFilter },
      { $project: { customer: 1, transactionData: 1, createdAt: 1 } },
      {
        $group: {
          _id: '$transactionData.id',
          orderCount: { $count: { } },
          customer: { $first: '$customer' },
          transactionData: { $first: '$transactionData' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $unwind: { path: '$transactionData' } },
      { $unwind: { path: '$transactionData' } },
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
                _id: 0,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer' } },
      // {
      //   $lookup: {
      //     from: 'orders',
      //     let: {
      //       trans_id: '$_id',
      //     },
      //     pipeline: [
      //       {
      //         $match: { $expr: { $eq: ['$transactionData.id', '$$trans_id'] } },
      //       },
      //       {
      //         $project: {
      //           event: 1,
      //           vendor: 1,
      //           status: 1,
      //           profile: { firstName: 1, lastName: 1, group: { companyName: 1 } },
      //           orderTotals: 1,
      //           orderNumber: 1,
      //           // transactionData: 1,
      //         },
      //       },
      //     ],
      //     as: 'orders',
      //   },
      // },
      { $sort: { createdAt: -1 } },
      { $limit: 5000 },

    ],
  );

  return res.send({
    totalCount,
    filteredCount: transactions.length,
    results: transactions,
  });
});

// ** Get Payment Transaction (Customer Orders)
router.get('/customer/transaction/:transId', verifyUser(['admin', 'customer']), async (req, res) => {
  const { transId } = req.params;
  // Get the parent vendor ID (if admin, then this must be provided)
  const customerFilter = res.user.role === 'customer' ? { customer: ObjectId(res.user._id) } : {};

  const transaction = await Order.aggregate(
    [
      { $match: { ...customerFilter, 'transactionData.id': transId } },
      { $project: { transactionData: 1, createdAt: 1, event: 1 } },
      {
        $group: {
          _id: '$transactionData.id',
          orderCount: { $count: { } },
          transactionData: { $first: '$transactionData' },
          createdAt: { $first: '$createdAt' },
        },
      },
      { $unwind: { path: '$transactionData' } },
      { $unwind: { path: '$transactionData' } },
      {
        $lookup: {
          from: 'orders',
          let: {
            trans_id: '$_id',
          },
          pipeline: [
            {
              $match: { $expr: { $eq: ['$transactionData.id', '$$trans_id'] } },
            },
            {
              $project: {
                event: 1,
                vendor: 1,
                status: 1,
                profile: {
                  firstName: 1, lastName: 1, group: { companyName: 1 }, subgroups: { name: 1 },
                },
                orderTotals: 1,
                orderNumber: 1,
                // transactionData: 1,
              },
            },
            {
              $lookup: {
                from: 'events',
                localField: 'event',
                foreignField: '_id',
                as: 'event',
              },
            },
          ],
          as: 'orders',
        },
      },
      { $sort: { createdAt: -1 } },

    ],
  );

  return res.send(transaction);
});

// ** List Transactions (Vendor Payouts)
router.get('/transactions/list/', verifyUser(['admin', 'vendor']), async (req, res) => {
  // Get the parent vendor ID (if admin, then this must be provided)
  const vendorFilter = res.user.role === 'vendor' ? { vendor: res.user._id } : {};
  const { type } = req.query;

  // const dateFilter = req.query.dateRange && req.query.group !== '' ? { group: ObjectId(req.query.group) } : {};

  const typeFilter = type ? { type } : {};
  const filterParams = {
    $and: [
      typeFilter,
      vendorFilter,
    ],
  };

  const totalCount = await Transaction.countDocuments(filterParams);

  const transactions = await Transaction.find(filterParams)
    .populate({
      path: 'event',
      populate: {
        path: 'group',
        select: {
          _id: 1, firstName: 1, lastName: 1, companyName: 1, email: 1,
        },
      },
    })
    .populate({
      path: 'event',
      populate: {
        path: 'store',
        select: {
          _id: 1, storeName: 1,
        },
      },
    })
    .populate({
      path: 'vendor',
      select: {
        _id: 1, firstName: 1, lastName: 1, notes: 1, companyName: 1, email: 1,
      },
    })
    .sort(
      { createdAt: -1 },
    );

  return res.send({
    totalCount,
    filteredCount: transactions.length,
    results: transactions,
  });
});

module.exports = router;
