// ** React Imports
import { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

// ** Stripe elements
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// ** Axios
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// import classnames from 'classnames';
import { priceFormatter, calculateOrderTotals } from '@utils';

// import { useForm } from 'react-hook-form';
// import Avatar from '@components/avatar';
import {
  ArrowLeft, CreditCard, CheckCircle, Circle,
} from 'react-feather';
import {
  Row, Col, Button, Card, CardBody, Spinner, ListGroup, ListGroupItem, Alert,
} from 'reactstrap';

// import { addOrder } from '@store/actions/order.actions';
import { updateCartOrder, getCartOrder } from '@store/actions/cart.actions';
// import { fetchEvents } from '@store/actions/event.actions';

// ** Components
// import Cart from '@src/components/Cart';
import CartSummary from '@src/components/CartSummary';
import UILoader from '@components/ui-loader';
import { Visa } from '@src/assets/svgs/creditcards';
// import { Switch } from 'react-router';
import classnames from 'classnames';
// import { conditionallyUpdateScrollbar } from 'reactstrap/lib/utils';
// import { computeSegDraggable } from '@fullcalendar/core';
import CheckoutForm from './CheckoutForm';
import { Mastercard } from '../../../../assets/svgs/creditcards';

// ** Utils

// Make sure to call loadStripe outside of a component’s render to avoid
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PRIVATE_KEY);

const Payment = ({
  stepper, currentOrder, currentCurrency,
}) => {
  if (!currentOrder) { return null; }
  const dispatch = useDispatch();
  const history = useHistory();

  const [clientSecret, setClientSecret] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState(0);

  const [customerStripeId, setCustomerStripeId] = useState('');
  const [customerPaymentMethods, setCustomerPaymentMethods] = useState({});

  const [isLoading, setIsLoading] = useState(false);
  const [stripeError, setStripeError] = useState(false);
  const [stripeErrorMessage, setStripeErrorMessage] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const currentStep = stepper ? stepper._currentIndex : 0;

    // if (stepper && stepper._currentIndex === 3) {
    if (currentStep === 3) {
      // recalculate order orderTotals
      const createPaymentIntent = async () => {
        // recalculate order totals
        const orderTotals = await calculateOrderTotals(currentOrder);
        const paymentAmount = orderTotals[0] ? parseInt(orderTotals[0].orderTotal.toFixed(2) * 100, 10) : 0;

        const clientSecret = currentOrder?.stripePaymentIntent ? currentOrder.stripePaymentIntent[0].clientSecret : false;
        const clientId = currentOrder?.customer.stripeCustomerId ? currentOrder.customer.stripeCustomerId : false;
        let paymentIntentId = currentOrder?.stripePaymentIntent && currentOrder?.stripePaymentIntent[0].paymentIntentId ? currentOrder?.stripePaymentIntent[0].paymentIntentId : false;
        // if we already have a successful payment intent then refresh
        if (paymentIntentId) {
          const paymentIntentResponse = await axios(`${process.env.REACT_APP_SERVER_URL}/api/payments/retrieve-payment-intent?paymentIntentId=${paymentIntentId}`, { method: 'GET', headers })
            .then((response) => response.data)
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.log(error);
            });

          if (paymentIntentResponse && paymentIntentResponse.paymentIntent.status === 'succeeded') {
            paymentIntentId = false;
          }
        }

        // if we still have a payment intent, then load it
        if (paymentIntentId) {
          // update the payment amount
          await fetch(`${process.env.REACT_APP_SERVER_URL}/api/payments/update-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: paymentAmount,
              paymentIntentId,
            }),
          });

          // get the payment methods
          await fetch(`${process.env.REACT_APP_SERVER_URL}/api/payments/retrieve-payment-methods?clientId=${clientId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
            .then((res) => res.json())
            .then(async (data) => {
              await dispatch(getCartOrder(currentOrder._id));
              setCustomerPaymentMethods(data.paymentMethods);
              setShowCardForm(!(data.paymentMethods && data.paymentMethods.data && data.paymentMethods.data.length > 0));
              await setCustomerStripeId(clientId);
              await setClientSecret(clientSecret);
              setTimeout(() => {
                setIsLoading(false);
              }, 1000);
            });
        } else {
          await fetch(`${process.env.REACT_APP_SERVER_URL}/api/payments/create-payment-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: paymentAmount,
              customer: currentOrder ? currentOrder.customer : '',
              cartId: currentOrder ? currentOrder._id : '',
              currency: currentCurrency,
            }),
          })
            .then((res) => res.json())
            .then(async (data) => {
              await dispatch(updateCartOrder(currentOrder._id, { stripePaymentIntent: [{ paymentIntentId: data.paymentIntentId, customerId: data.customerId, clientSecret: data.clientSecret }] }));
              await dispatch(getCartOrder(currentOrder._id));
              setCustomerPaymentMethods(data.paymentMethods);
              setShowCardForm(!(data.paymentMethods && data.paymentMethods.data && data.paymentMethods.data.length > 0));
              await setCustomerStripeId(data.customerId);
              await setClientSecret(data.clientSecret);

              setTimeout(() => {
                setIsLoading(false);
              }, 1000);
            });
        }
        // set state with the result
        // setData(json);
      };

      // eslint-disable-next-line no-console
      createPaymentIntent().catch(console.error);
    }

    // }
  }, [stepper?._currentIndex]);

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  const handlePreviousClick = async () => {
    await dispatch(updateCartOrder(currentOrder._id, { currentStep: 3 }));
    stepper.previous();
  };

  const handleExistingPaymentMethod = async (paymentMethodIndex) => {
    setStripeError(false);
    setStripeErrorMessage('');
    const orderTotals = await calculateOrderTotals(currentOrder);
    const paymentAmount = orderTotals[0] ? parseInt(orderTotals[0].orderTotal.toFixed(2) * 100, 10) : 0;
    setIsLoading(true);
    const cartId = currentOrder ? currentOrder._id : '';

    await fetch(`${process.env.REACT_APP_SERVER_URL}/api/payments/reuse-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: paymentAmount,
        customer: currentOrder ? currentOrder.customer : '',
        cartId,
        customerStripeId,
        paymentMethodIndex,
        stripePaymentIntent: currentOrder ? currentOrder.stripePaymentIntent : '',
      }),
    })
      .then(async (res) => res.json())
      .then(async (data) => {
        setIsLoading(false);
        if (data.success === 'success') {
          history.push(`/customer/order/checkout/confirmation/?cartId=${cartId}&payment_intent=${data.paymentIntent.id}&payment_intent_client_secret=${data.clientSecret}&redirect_status=succeeded`);
        } else {
          // eslint-disable-next-line no-console
          console.log('Something went wrong.');
          setStripeError(true);
          setStripeErrorMessage(data.message);
        }
      });
  };

  const renderCard = (brand) => {
    if (brand === 'visa') {
      return <Visa />;
    } if (brand === 'mastercard') {
      return <Mastercard />;
    }
    return <CreditCard />;
  };

  // console.log('customerPaymentMethods', customerPaymentMethods);

  return (
    <>
      <Row>
        <Col sm={8} lg={4} className=" d-flex flex-wrap offset-lg-1">
          <div className="mb-2 d-flex justify-content-between w-100">
            <h2 className="mb-1">
              Almost there, please provide payment details
            </h2>

            {/* <small className="text-muted d-flex align-items-center">
              <Shield size="16" />
              <span className="d-flex">Secure checkout</span>
            </small> */}
          </div>

        </Col>
      </Row>
      { stripeError ? (
        <Row>
          <Col sm={8} lg={6} className="offset-lg-1">
            <Alert color="danger">
              <div className="alert-body">
                <span>{`Error: ${stripeErrorMessage}`}</span>
              </div>
            </Alert>
          </Col>
        </Row>
      ) : <></>}
      <Row>
        <Col sm={8} lg={6} className="offset-lg-1">
          <Card className="card-payment w-100">
            <CardBody>
              <Row>
                <Col sm={6} className="">
                  <h5>Billing Details</h5>
                  <div>
                    {currentOrder ? currentOrder.createdBy.firstName : ''}
                    {' '}
                    {currentOrder ? currentOrder.createdBy.lastName : ''}
                  </div>
                  <div>{currentOrder ? currentOrder.createdBy.email : ''}</div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Row>
            <Col className=" d-flex flex-wrap">
              <Card className="card-payment w-100">
                <UILoader blocking={isLoading}>
                  <CardBody>

                    <div className="d-flex justify-content-between align-items-top mb-2">
                      <h5 className="mb-0">Payment Details</h5>
                    </div>

                    {(customerPaymentMethods?.data && customerPaymentMethods?.data.length > 0) && (
                      <>
                        <ListGroup className="stored-payment-options">
                          {
                            customerPaymentMethods.data.map((paymentMethod, i) => (

                              <ListGroupItem
                                key={i}
                                className={classnames('d-flex', 'align-items-center', {
                                  active: activePaymentMethod === i,
                                })}
                                onClick={() => { setShowCardForm(false); setActivePaymentMethod(i); }}
                              >
                                {activePaymentMethod === i ? <CheckCircle className="checkbox mr-1" size={22} /> : <Circle className="checkbox mr-1" size={22} />}
                                {renderCard(paymentMethod.card.brand)}

                                <p className="transaction-title mb-0 ml-1">
                                  {`**** **** **** ${paymentMethod.card.last4}`}
                                </p>
                                <p className="transaction-title mb-0 ml-1">
                                  {` ${paymentMethod.card.exp_month}/${paymentMethod.card.exp_year}`}
                                </p>
                                {/* <small className="ml-auto">edit</small> */}

                              </ListGroupItem>
                            ))
                          }
                        </ListGroup>

                        <Button.Ripple
                          color="flat-secondary"
                          size="sm"
                          className="p-0 mt-1 mb-2"
                          onClick={() => {
                            setIsLoading(true);
                            setActivePaymentMethod(-1);
                            setShowCardForm(true);
                            setTimeout(() => {
                              setIsLoading(false);
                            }, 1000);
                          }}
                        >
                          {!showCardForm ? '+ New payment method' : ''}
                        </Button.Ripple>

                      </>
                    )}

                    {(clientSecret && showCardForm) && (
                      <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm onLoadingChange={setIsLoading} currentOrder={currentOrder} customerId={customerStripeId} />
                      </Elements>
                    )}

                  </CardBody>
                </UILoader>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col lg={4}>
          <CartSummary currentOrder={currentOrder} />
        </Col>

      </Row>

      {/* <small>
        Orders will be supplied by Subway Eltham (ph: 0400 404 493)
      </small> */}

      <div className="action-wrapper d-flex justify-content-center">
        <Button.Ripple color="primary" disabled={isLoading} outline className="btn-prev mr-1" onClick={() => handlePreviousClick()}>
          <ArrowLeft size={14} className="align-middle mr-sm-25 mr-0" />
          <span className="align-middle d-sm-inline-block d-none">Back</span>
        </Button.Ripple>

        {!showCardForm ? (
          <Button.Ripple color="primary" disabled={isLoading} className="btn-submit" onClick={() => handleExistingPaymentMethod(activePaymentMethod)}>
            {isLoading ? (
              <div className="d-flex align-items-center">
                <Spinner color="light" size="sm" className="mr-1" />
                Please wait...
              </div>
            ) : (
              <>
                Confirm Payment
                {' '}
                {priceFormatter(currentOrder?.orderTotals[0]?.orderTotal)}
              </>
            )}
          </Button.Ripple>
        ) : (
          <Button.Ripple form="payment-form" type="submit" color="primary" className="btn-submit">
            {isLoading ? (
              <div className="d-flex align-items-center">
                <Spinner color="light" size="sm" className="mr-1" />
                Please wait...
              </div>
            ) : (
              <>
                Confirm Payment
                {' '}
                {priceFormatter(currentOrder?.orderTotals[0]?.orderTotal)}
              </>
            )}
          </Button.Ripple>
        )}

      </div>

    </>
  );
};

export default Payment;
