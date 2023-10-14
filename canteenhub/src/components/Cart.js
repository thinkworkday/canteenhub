/* eslint-disable jsx-a11y/label-has-associated-control */
// ** React Imports
import { useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { updateCartOrder } from '@store/actions/cart.actions';

// ** Third Party Components
import {
  Alert, Button,
} from 'reactstrap';
import {
  X,
} from 'react-feather';

// ** Utils
import classnames from 'classnames';

// import moment from 'moment';
import { priceFormatter, calculateOrderTotals } from '@utils';
import { cartQtyOptions, qtySelectStyles } from '@src/models/constants/qtyOptions';

// ** Custom Components
import UILoader from '@components/ui-loader';
import Select from 'react-select';

// const calculateOrderTotals = () => ({
//   orderLinesSubtotal: '22',
//   orderLinesTax: '2',
//   orderDiscount: '33',
//   orderTotal: '33',
// });

const Cart = (props) => {
  const dispatch = useDispatch();

  // ** Props
  const {
    currentOrder, showCart, setShowCart,
  } = props;

  // ** State
  const [isProcessing, setProcessing] = useState(false);

  const handleQtyChange = async (selectedQty, orderLine, currentOrder) => {
    setProcessing(true);

    // get index of orderLine
    const orderLineIndex = currentOrder.orderLines.findIndex((x) => x === orderLine);
    if (selectedQty.value === 0) {
      delete currentOrder.orderLines[orderLineIndex];
    } else {
      currentOrder.orderLines[orderLineIndex].qty = selectedQty.value;
      currentOrder.orderLines[orderLineIndex].subtotal = selectedQty.value * orderLine.priceEach;
    }
    const orderLines = currentOrder.orderLines.filter((x) => x != null);
    // const newOrderLines = [];
    // orderLines.forEach((orderLine) => {
    //   const idx = newOrderLines.findIndex((e) => e.profile.id === orderLine.profile._id);
    //   if (idx < 0) {
    //     newOrderLines.push({
    //       profile: orderLine.profile,
    //       orderLines: [orderLine],
    //     });
    //   } else {
    //     newOrderLines[idx].orderLines.push(orderLine);
    //   }
    // });

    // Update Order
    try {
      const orderTotals = await calculateOrderTotals(currentOrder);
      await dispatch(updateCartOrder(currentOrder._id, { orderLines, orderTotals }));

      // setProcessing(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('ERROR', err);
      setProcessing(false);
    }
    setProcessing(false);
  };

  // ** Render cart items
  const renderCart = () => {
    const newOrderLines = [];

    currentOrder.orderLines.forEach((orderLine) => {
      const idx = newOrderLines.findIndex((e) => e.profile._id === orderLine.profile._id);
      if (idx < 0) {
        newOrderLines.push({
          profile: orderLine.profile,
          orderLines: [orderLine],
        });
      } else {
        newOrderLines[idx].orderLines.push(orderLine);
      }
    });

    return newOrderLines.map((profileLine, idx) => (
      <div className="profile-list d-flex flex-column" key={`profile-${profileLine.profile._id}-${idx}`}>

        <h6 className="mb-0">
          {profileLine.profile.firstName}
          {' '}
          {profileLine.profile.lastName}
        </h6>
        <small className="mb-1">{profileLine.profile.group.companyName}</small>
        <ul className="list-unstyled">
          {profileLine.orderLines.map((orderLine, i) => {
            const optionsSelected = orderLine.options.map((x) => x.optionsSelected.map((x) => (x.price ? ` ${x.name} (+$${x.price})` : ` ${x.name}`)));

            return (
              <li key={`orderLine-${i}`} className="">
                <UILoader blocking={isProcessing} className="order-item d-flex justify-content-between">

                  <div className="detail-title">
                    <div className="d-flex">
                      <div className="quantity-events">
                        <Select
                          styles={qtySelectStyles}
                          className="react-select"
                          defaultValue={cartQtyOptions[orderLine.qty]}
                          options={cartQtyOptions}
                          isClearable={false}
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                          onChange={(e) => {
                            handleQtyChange(e, orderLine, currentOrder);
                          }}
                          menuPortalTarget={document.body}
                          menuPosition="absolute"
                          menuShouldScrollIntoView={false}
                        />
                        <small>
                          <span>Events: </span>
                          x
                          {orderLine.events.length}
                        </small>
                      </div>
                      <div className="ml-1 description">
                        <div className="">
                          {orderLine ? orderLine.name : ''}
                        </div>
                        <small className="text-muted d-block mt-0">{optionsSelected.toString()}</small>
                      </div>
                    </div>

                  </div>
                  <div className="detail-amt">
                    {orderLine ? priceFormatter(orderLine.subtotal * orderLine.events.length) : ''}
                    {/* {priceFormatter(lineSubTotal)} */}
                  </div>
                </UILoader>
              </li>
            );
          })}
        </ul>
      </div>
    ));
  };

  return (
    <div className={classnames('d-none', 'flex-column', 'list-view', 'product-checkout', 'mini-cart', { 'd-flex': showCart })}>
      <div className="d-flex justify-content-between">
        <h4 className="mt-1 mb-1">
          My Order
        </h4>
        <Button color="flat-secondary" className="d-lg-none btn-sm pr-0" onClick={() => setShowCart(false)}>
          <X />
        </Button>
      </div>
      <div className="checkout-items">
        {currentOrder && currentOrder.orderLines && currentOrder.orderLines.length > 0 ? (renderCart()) : (
          <Alert color="info">
            <div className="alert-body">
              <span>Your cart is empty</span>
            </div>
          </Alert>
        )}

      </div>
      {currentOrder && currentOrder.orderLines && currentOrder.orderLines.length > 0 ? (
        <div className="price-details mt-auto">
          <ul className="list-unstyled">
            {/* <li className="price-detail d-flex justify-content-between">
              <div className="detail-title">Lines Subtotal</div>
              <div className="detail-amt">{currentOrder && currentOrder.orderTotals[0]?.orderLinesSubtotal ? priceFormatter(currentOrder.orderTotals[0].orderLinesSubtotal) : ''}</div>
            </li>
            <li className="price-detail d-flex justify-content-between">
              <div className="detail-title">Order Events</div>
              <div className="detail-amt">
                {currentOrder && currentOrder.orderTotals[0]?.orderEvents ? (
                  <span id="orderDates" className="cursor-pointer">
                    x
                    {currentOrder.orderTotals[0]?.orderEvents}
                  </span>
                ) : ''}
                <UncontrolledTooltip placement="top" target="orderDates">
                  {currentOrder && currentOrder.events && currentOrder.events.length > 0 ? currentOrder.events.map((event, i) => (
                    <span key={i}>
                      {event ? `${moment(event.date).format('DD/MM/YYYY')}, ` : '' }
                    </span>
                  )) : <small>No events</small>}
                </UncontrolledTooltip>
              </div>
            </li> */}
            <li className="separator" />
            <li className="price-detail d-flex justify-content-between">
              <div className="detail-title">Subtotal</div>
              <div className="detail-amt">{currentOrder && currentOrder.orderTotals[0]?.orderSubtotal ? priceFormatter(currentOrder.orderTotals[0].orderSubtotal) : ''}</div>
            </li>
            <li className="price-detail d-flex justify-content-between">
              <div className="detail-title">Transaction Fee</div>
              <div className="detail-amt ">{currentOrder && currentOrder.orderTotals[0]?.orderFees ? priceFormatter(currentOrder.orderTotals[0].orderFees) : ''}</div>
            </li>
            { currentOrder && currentOrder.orderTotals[0]?.orderLateFees ? (
              <li className="price-detail d-flex justify-content-between">
                <div className="detail-title">Late Order Fee</div>
                <div className="detail-amt">{ priceFormatter(currentOrder.orderTotals[0].orderLateFees) }</div>
              </li>
            ) : '' }
            <li className="price-detail detail-total d-flex justify-content-between">
              <div className="detail-title font-weight-bolder">Total</div>
              <div className="detail-amt font-weight-bolder">{currentOrder && currentOrder.orderTotals[0]?.orderTotal ? priceFormatter(currentOrder.orderTotals[0].orderTotal) : ''}</div>
            </li>
          </ul>
        </div>
      ) : ''}

    </div>
  );
};

export default Cart;
