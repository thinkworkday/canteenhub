/* eslint-disable no-case-declarations */
const router = require('express').Router();
const stripe = require('stripe');
const express = require('express');

const CartOrder = require('../model/CartOrders');
const { buildOrderData, createOrdersFromCartOrder } = require('../utils/orderFunctions');

// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_PISUCCEED;

router.post('/payment-intent-handler', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // get the cart order
      const cartOrder = await CartOrder.find({ 'stripePaymentIntent.0.paymentIntentId': paymentIntentId });
      if (cartOrder.length === 0) {
        // eslint-disable-next-line consistent-return
        return res.status(403).send(`Webhook Error: error finding cart order or order already exists for ${paymentIntentId}`);
      }
      // eslint-disable-next-line no-case-declarations
      const orderData = await buildOrderData(cartOrder[0], paymentIntent);
      try {
        await createOrdersFromCartOrder(orderData);
        await CartOrder.findByIdAndDelete(cartOrder[0]._id);
      } catch (err) {
        res.status(402).send(err);
      }
      break;
    default:
      // console.log(`Unhandled event type ${event.type}`);
  }
  res.send();
});

module.exports = router;
