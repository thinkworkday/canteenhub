/* eslint-disable no-console */
// ** React Imports
import { useState, useCallback } from 'react';
// ** Stripe
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export default function CheckoutForm({ onLoadingChange, currentOrder, customerId }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);

  const handleLoadingChange = useCallback((value) => {
    onLoadingChange(value);
  }, [onLoadingChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
    }
    handleLoadingChange(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: `${process.env.REACT_APP_SITE_URL}/customer/order/checkout/?`,
        return_url: `${process.env.REACT_APP_SITE_URL}/customer/order/checkout/confirmation/?cartId=${currentOrder._id}`,
        // receipt_email: currentOrder.createdBy.email, // if populated, will send email receipt
      },
    });

    // // This point will only be reached if there is an immediate error when
    // // confirming the payment. Otherwise, your customer will be redirected to
    // // your `return_url`. For some payment methods like iDEAL, your customer will
    // // be redirected to an intermediate site first to authorize the payment, then
    // // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occured.');
    }
    handleLoadingChange(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
      <PaymentElement id="payment-element" />
      {/* <Button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner" /> : 'Pay now'}
        </span>
      </Button> */}

    </form>
  );
}
