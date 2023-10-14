// ** React Imports
import { useEffect, useState } from 'react';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
// import { getOrder, updateOrder } from '@store/actions/order.actions';
import { getOrderNotes } from '@store/actions/orderNotes.actions';

//* * Components
import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Third Party Components
import {
  Alert,
  Badge,
  Card,
  CardBody,
  CardText,
  Row,
  Col,
  FormGroup,
  Label,
} from 'reactstrap';

import UILoader from '@components/ui-loader';
import {
  getDeliveryDate, getCutOffDate, priceFormatter, getLoggedUser, getDeliveryOnlyDate,
} from '@utils';
import OrderNotes from '../components/OrderNotes';

const OrderEditCard = () => {
  const dispatch = useDispatch();

  // ** States
  const order = useSelector((state) => state.orders.selectedOrder);

  // ** States
  // const [count, setCount] = useState(1);
  const [isProcessing, setProcessing] = useState(false);

  const loggedUser = getLoggedUser();

  const profile = order.profile[0];
  const { event, orderLines } = order;
  const { store } = order.event;
  const orderTotals = order.orderTotals[0];

  // ** Get invoice on mount based on id
  useEffect(() => {
    dispatch(getOrderNotes({ orderId: order._id }));
  }, []);

  // ** Render order lines
  const renderOrderLines = () => orderLines.map((orderLine, i) => {
    const optionsSelected = orderLine.options.map((x) => x.optionsSelected.map((x) => (x.price ? ` ${x.name} (+$${x.price})` : ` ${x.name}`)));

    return (
      <li key={`orderLine-${i}`} className="order-item d-flex justify-content-between align-items-center">
        {/* <div className="detail-title"> */}
        {/* <div className="d-flex flex-wrap flex-sm-nowrap align-items-center"> */}
        <div>
          {`${orderLine.qty}`}
          &nbsp;x
        </div>
        <div className="ml-1 image">
          <img className="" src={orderLine.image} alt={orderLine.name} />
        </div>
        <div className="ml-1 description pr-4">
          <div className="">
            {orderLine ? orderLine.name : ''}
          </div>
          <small className="text-muted d-block mt-0">{optionsSelected.toString()}</small>
        </div>
        <div className="detail-amt ml-auto">
          <div className="d-flex align-items-center">
            <span className="badge badge-light-primary">
              {orderLine.currency ? orderLine.currency : 'AUD'}
              {' '}
            </span>
            <span>
              {' '}
              {orderLine ? priceFormatter(orderLine.subtotal) : ''}
            </span>
          </div>
          {/* {priceFormatter(lineSubTotal)} */}
        </div>
        {/* </div> */}

        {/* </div> */}

      </li>
    );
  });

  return (
    <Card className="invoice-preview-card mb-2">
      <UILoader blocking={isProcessing}>
        {order.status === 'pending' ? (
          <Alert color="warning">
            <div className="alert-body">
              <span>Order is pending as it was placed after cutoff. It will need to be approved before delivery to be included in payouts. If declined, customer will be refunded</span>
            </div>
          </Alert>
        ) : ''}

        <CardBody className="invoice-padding pt-3 pb-0">

          <Row className="invoice-spacing">
            <Col className="" lg="8">
              <h2 className="mb-2">
                Order #
                {order.orderNumber}
              </h2>
              <p className="card-text mb-0">
                {order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : ''}
              </p>
              <p className="card-text mb-25">
                {`${order.customer.email}`}
              </p>
            </Col>
            <Col className=" mt-xl-0 mt-2" lg="4">
              <div className="invoice-number-date mt-md-0 mt-2">
                <div className="d-flex align-items-center mb-1">
                  <span className="title">Status: &nbsp;</span>
                  <DisplayStatus status={order.status} />
                </div>
                <div className="d-flex align-items-center mb-1">
                  <span className="title">Event Date: &nbsp;</span>
                  {getDeliveryOnlyDate(event.date)}
                  {loggedUser.role === 'admin' || loggedUser.role === 'group' || loggedUser.role === 'vendor' || loggedUser.role === 'store' ? <a href={`/${loggedUser.role}/order-dates/${loggedUser.role === 'group' ? 'view' : 'edit'}/${event._id}`} className=" ml-1"><small>view</small></a> : ''}
                </div>
                <div className="d-flex align-items-center mb-1">
                  <span className="title">Delivery Time: &nbsp;</span>
                  {event.deliveryTime}
                </div>
                <div className="d-flex align-items-center mb-1">
                  <span className="title">Order Cutoff: &nbsp;</span>
                  {getCutOffDate(getDeliveryDate(event.date, event.deliveryTime), event.cutoffPeriod, true)}

                </div>
              </div>
            </Col>
          </Row>

        </CardBody>
        {/* /Header */}

        <hr className="invoice-spacing" />

        {/* Address and Contact */}
        <CardBody className="mt-2 invoice-padding pt-1">

          <Row className="invoice-spacing justify-content-between">
            <Col className="" lg="4">
              <h5 className="mb-2">Order For:</h5>
              <p className="mb-0">
                <strong>{profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'Loading...'}</strong>
              </p>
              <CardText className="mb-0">
                {profile && profile.group ? profile.group.companyName : ''}
                {' '}
                (
                {profile && profile.subgroups ? profile.subgroups[0].name : ''}
                )
              </CardText>
              <small className="mb-1 d-block">
                {profile && profile.group ? profile.group.address[0].formattedAddress : ''}
                {' '}
                (
                {profile && profile.subgroups ? profile.subgroups[0].name : ''}
                )
              </small>
              <CardText className="mb-0">
                <span className="mr-1">Allergies:</span>
                {profile.allergies && profile.allergies.length > 0 ? profile.allergies.map((allergy, i) => (
                  <Badge key={i} color="light-danger" className="inline">
                    {allergy}
                  </Badge>
                )) : <small>nil</small>}
              </CardText>
            </Col>
            <Col className=" mt-xl-0 mt-2" lg="4">
              <h6 className="mb-2">Store Details:</h6>
              {store ? (
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <span className="font-weight-bold">{store && store.storeName ? store.storeName : ''}</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>
                          {store.storeAddress ? store.storeAddress[0].formattedAddress : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>
                          e:
                          {' '}
                          {store.storeEmail ? store.storeEmail : ''}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span>
                          p:
                          {' '}
                          {store.storePhone ? store.storePhone : ''}
                        </span>
                      </td>
                    </tr>

                  </tbody>
                </table>
              ) : ''}
            </Col>
          </Row>
        </CardBody>
        {/* /Address and Contact */}

        <OrderNotes orderId={order._id} />
        <hr className="invoice-spacing" />

        {/* Product Details */}
        <CardBody className="invoice-padding invoice-product-details">
          <Row className="mb-2 align-items-center">
            <Col>
              <h4 className="mb-0">Order Items</h4>
            </Col>
            {/* <Col>
              <Button.Ripple color="primary" outline size="sm" className="btn-add-new float-right" onClick={() => setCount(count + 1)}>
                <Plus size={14} className="mr-25" />
                <span className="align-middle">Add Item</span>
              </Button.Ripple>
            </Col> */}
          </Row>
          <hr />

          <div className="checkout-items">
            {orderLines.length > 0 ? (
              <ul className="list-unstyled order-lines">
                {renderOrderLines()}
              </ul>
            ) : (
              <Alert color="info">
                <div className="alert-body">
                  <span>Your cart is empty</span>
                </div>
              </Alert>
            )}

          </div>

          <Row className="mt-3">
            <Col sm="12" className="px-0" />
          </Row>
        </CardBody>
        {/* /Product Details */}

        {/* Invoice Total */}
        <CardBody className="invoice-padding">
          <Row className="invoice-spacing justify-content-end">
            <Col className=" mt-xl-0 mt-2" md={{ size: '6', order: 2 }} xl={{ size: 2, order: 1 }}>
              <div className="invoice-number-date mt-md-0 mt-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <p className="invoice-total-title">Currency:</p>
                  <p className="invoice-total-amount">
                    <span className="badge badge-light-primary">
                      {orderTotals.orderCurrency ? orderTotals.orderCurrency : 'AUD'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="invoice-number-date mt-md-0 mt-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <p className="invoice-total-title">Subtotal:</p>
                  <p className="invoice-total-amount">{orderTotals && orderTotals.orderLinesSubtotal ? priceFormatter(orderTotals.orderLinesSubtotal) : ''}</p>
                </div>
              </div>
              <div className="invoice-number-date mt-md-0 mt-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <p className="invoice-total-title">Transaction Fee:</p>
                  <p className="invoice-total-amount">{orderTotals && orderTotals.orderFees ? priceFormatter(orderTotals.orderFees / orderTotals.orderEvents) : ''}</p>
                </div>
              </div>
              {orderTotals && orderTotals.orderLateFees ? (
                <div className="invoice-number-date mt-md-0 mt-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <p className="invoice-total-title">Late Order Fee:</p>
                    <p className="invoice-total-amount">{priceFormatter(orderTotals.orderLateFees / orderTotals.orderEvents)}</p>
                  </div>
                </div>
              ) : ''}
              <hr className="my-50" />
              <div className="invoice-number-date mt-md-0 mt-2">
                <div className="d-flex justify-content-between align-items-center pt-2 mb-1">
                  <h4><strong>Total:</strong></h4>
                  <h4>{orderTotals && orderTotals.orderTotal ? priceFormatter(orderTotals.orderTotal / orderTotals.orderEvents) : ''}</h4>
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
        {/* /Invoice Total */}

        <hr className="invoice-spacing mt-0" />

        {/* Invoice Note */}
        <CardBody className="invoice-padding py-0">
          <Row>
            <Col>
              <FormGroup className="mb-2">
                <Label for="note" className="form-label font-weight-bold">
                  Profile Notes:
                </Label>
                <Alert color="light">
                  <div className="alert-body">
                    {order.profile[0].notes}
                  </div>
                </Alert>
                {/* <Input type="textarea" rows="2" id="note" defaultValue={note} /> */}
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        {/* /Invoice Note */}

        <hr className="invoice-spacing mt-0" />

        <CardBody className="invoice-padding py-0">
          <Row>
            <Col>
              {orderTotals.charitySettings && order.charitySettings[0].active ? (
                <FormGroup className="mb-1">
                  <Label for="note" className="form-label font-weight-bold">
                    Donation:
                    {' '}
                    {priceFormatter(orderTotals.orderDonation)}
                    {' '}
                    will be donated to
                    {' '}
                    {order.charitySettings[0].selectedCharity.label}
                  </Label>
                </FormGroup>
              ) : ''}
              <FormGroup className="mb-1">
                <Label for="note" className="form-label font-weight-bold">
                  Transaction ID:
                  {' '}
                  {order.transactionData[0].id}
                </Label>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>

      </UILoader>
    </Card>
  );
};

export default OrderEditCard;
