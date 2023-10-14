/* eslint-disable no-console */
/* eslint-disable camelcase */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import { buildOrderData } from '@utils';
import { addOrder } from '@store/actions/order.actions';
import { deleteCartOrder } from '@store/actions/cart.actions';
// ** Stripe elements
import {
  Row, Col, Button,
} from 'reactstrap';

const OrderConfirmation = () => {
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [alreadyPlaced, setAlreadyPlaced] = useState(false);
  // const [paymentStatus, setPaymentStatus] = useState();

  const query = new URLSearchParams(window.location.search);
  const cartId = query.get('cartId');
  const paymentIntentId = query.get('payment_intent');

  async function completeOrder() {
    if (!paymentIntentId) {
      return null;
    }

    // Check to see if payment ID has already been used, if so, exit immediately
    // Important: this code is causing some orders to not be created
    // const existingOrders = await axios(`${process.env.REACT_APP_SERVER_URL}/api/orders/list`, {
    //   method: 'GET',
    //   headers,
    //   params: { transactionDataID: paymentIntentId },
    // })
    //   .then((response) => response.data)
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // if (existingOrders && existingOrders.results && existingOrders.results.length > 0) { setAlreadyPlaced(true); return null; }

    // Get the Payment Intent
    const paymentIntentResponse = await axios(`${process.env.REACT_APP_SERVER_URL}/api/payments/retrieve-payment-intent?paymentIntentId=${paymentIntentId}`, {
      method: 'GET',
      headers,
    })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });
    // if order created, then exit to avoid multiple orders
    if (paymentIntentResponse?.paymentIntent?.metadata?.orderCreated === 'true') {
      setAlreadyPlaced(true); return null;
    }

    // Get the current order from DB
    const currentOrder = await axios(`${process.env.REACT_APP_SERVER_URL}/api/cartOrders/${cartId}`, {
      method: 'GET',
      headers,
    })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
      });
    if (!currentOrder) { return null; }
    // setPaymentStatus(paymentIntentResponse.paymentIntent.status);

    switch (paymentIntentResponse.paymentIntent.status) {
      case 'succeeded':
        // Clear the cart order in state management
        await dispatch({
          type: 'GET_CART_ORDER',
          selectedOrder: null,
        });
        // Create Order
        // eslint-disable-next-line no-case-declarations
        // const orderData = await buildOrderData(currentOrder, paymentIntentResponse.paymentIntent);
        // await dispatch(addOrder(orderData));
        // delete current cart order
        // await dispatch(deleteCartOrder(currentOrder._id));
        break;
      case 'processing':
        console.log('Your payment is processing.');
        break;
      case 'requires_payment_method':
        setError('Your payment was not successful, please try again.');
        break;
      default:
        setError('Something went wrong processing your order, please try again.');
        break;
    }

    return false;
  }

  useEffect(() => {
    completeOrder();
  }, []);

  return (
    <>

      <Row className="mt-5">
        <Col sm={6} className=" d-flex flex-wrap">
          {error ? <h2>{error}</h2> : (
            <>
              <h1>
                Your order has
                {' '}
                {alreadyPlaced ? 'already' : ''}
                {' '}
                been placed
              </h1>
              <p>Thank you for placing an order with Canteen Hub. You can manage all orders within your dashboard. Please note, orders cannot be altered after the cut-off dates, so please ensure any changes are made prior to those dates.</p>
            </>
          )}
          {/* <br />
            Order Number: [ORDER_NUM]
            {' '}
            <br />
            Order Value: [ORDER_VALUE] */}
        </Col>
      </Row>

      <Row className="mt-3">
        <Col sm={6} className=" d-flex flex-wrap">
          {/* <Button.Ripple tag={Link} to="/customer/profiles/form/edit/" color="outline-primary" className=" mr-1">Place another order</Button.Ripple> */}
          <Button.Ripple tag={Link} to="/" type="submit" color="primary" className="btn-submit">
            <span className="align-middle ">Dashboard</span>
          </Button.Ripple>
        </Col>
      </Row>
    </>
  );
};

export default OrderConfirmation;
