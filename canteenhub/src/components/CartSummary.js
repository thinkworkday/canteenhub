/* eslint-disable jsx-a11y/label-has-associated-control */
// ** React Imports
import { useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { updateCartOrder } from '@store/actions/cart.actions';

// ** Third Party Components
import {
  Card, CardBody, UncontrolledTooltip,
} from 'reactstrap';

// ** Utils
import moment from 'moment';
import { getInitials, priceFormatter, calculateOrderTotals } from '@utils';
// import { cartQtyOptions, qtySelectStyles } from '@src/models/constants/qtyOptions';

// ** Custom Components
import Avatar from '@components/avatar';
// import UILoader from '@components/ui-loader';
// import Select from 'react-select';
// import { DateItem } from '@src/components/DateItem';

const CartSummary = (props) => {
  // const dispatch = useDispatch();

  // ** Props
  const {
    currentOrder,
  } = props;

  const currentOrderProfile = currentOrder ? currentOrder?.profile[0] : [];

  // ** State
  // const [isProcessing, setProcessing] = useState(false);
  // const [orderSubtotals, setOrderSubtotals] = useState({});

  // const handleQtyChange = async (selectedQty, orderLine, currentOrder) => {
  //   setProcessing(true);

  //   // console.log('qty changed');

  //   // get index of orderLine
  //   const orderLineIndex = currentOrder.orderLines.findIndex((x) => x === orderLine);
  //   if (selectedQty.value === 0) {
  //     delete currentOrder.orderLines[orderLineIndex];
  //   } else {
  //     currentOrder.orderLines[orderLineIndex].qty = selectedQty.value;
  //   }
  //   const orderLines = currentOrder.orderLines.filter((x) => x != null);

  //   // Update Order
  //   try {
  //     const orderTotals = await calculateOrderTotals(currentOrder);
  //     await dispatch(updateCartOrder(currentOrder._id, { orderLines, orderTotals }));

  //     // setProcessing(false);
  //   } catch (err) {
  //     // eslint-disable-next-line no-console
  //     console.log('ERROR', err);
  //     setProcessing(false);
  //   }
  //   setProcessing(false);
  // };

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

    return newOrderLines.map((profileLine, idx) => {
      const fullName = `${profileLine.profile.firstName} ${profileLine.profile.lastName}`;
      const initals = getInitials(fullName);

      return (
        <div className="profile-list d-flex flex-column" key={`profile-${profileLine.profile._id}-${idx}`}>

          <div className="media mb-1">
            <div className="avatar mr-75 bg-success"><span className="avatar-content">{initals}</span></div>
            <div className="my-auto media-body">
              <h6 className="mb-0">{fullName}</h6>
              <small>{profileLine.profile.group.companyName}</small>
            </div>
          </div>

          <ul className="list-unstyled">
            {profileLine.orderLines.map((orderLine, i) => {
              const optionsSelected = orderLine.options.map((x) => x.optionsSelected.map((x) => (x.price ? ` ${x.name} (+$${x.price})` : ` ${x.name}`)));

              return (
                <li key={`orderLine-${i}`} className="order-item d-flex justify-content-between">

                  <div className="detail-title">
                    <div className="d-flex">

                      <div className="event-count">
                        Events: x
                        {orderLine.events.length}
                      </div>

                      {/* <div className="quantity-events">
                      <small>
                        {orderLine.qty}
                        x
                      </small>
                    </div> */}

                      {/* <small className="ml-2">
                      {orderLine.events.map((event, i) => (
                        <div key={i}>
                          {event ? `${moment(event.date).format('DD/MM/YYYY')}` : '' }
                        </div>
                      ))}
                    </small> */}
                      <div className=" description pr-1">
                        <div className="">
                          <strong>
                            {orderLine.qty}
                            {' '}
                            x
                            {' '}
                            {orderLine ? orderLine.name : ''}
                          </strong>
                        </div>
                        <small className="text-muted d-block mt-0">{optionsSelected.toString()}</small>
                      </div>

                    </div>

                  </div>
                  <div className="detail-amt">
                    {orderLine ? priceFormatter(orderLine.subtotal * orderLine.events.length) : ''}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
    // return (
    //   <li key={`orderLine-${i}`} className="order-item d-flex justify-content-between">
    //     <div className="detail-title">
    //       <div className="d-flex">
    //         {orderLine.qty}
    //         {' '}
    //         x

    //         <div className="ml-1 description">
    //           <div className="">
    //             {orderLine ? orderLine.name : ''}
    //           </div>
    //           <small className="text-muted d-block mt-0">{optionsSelected.toString()}</small>
    //         </div>
    //       </div>

    //     </div>
    //     <div className="detail-amt">
    //       {orderLine ? priceFormatter(orderLine.qty * orderLine.subtotal) : ''}
    //       {/* {priceFormatter(lineSubTotal)} */}
    //     </div>
    //   </li>
    // );
  };

  return (

    <Card>
      <CardBody>
        <div className="d-flex flex-column   list-view product-checkout mini-cart-summary">
          <h5 className="mt-0 mb-0">Order Summary</h5>

          <div className="profile-order-wrapper">
            {/* <div className="profile-order-details d-flex justify-content-between">
              <Avatar color="success" id="profileName" content={`${currentOrderProfile.firstName} ${currentOrderProfile.lastName}`} size="sm" initials />
              <UncontrolledTooltip placement="top" target="profileName">
                {`${currentOrderProfile.firstName} ${currentOrderProfile.lastName}`}
              </UncontrolledTooltip>

              <div className="events">
                {currentOrder && currentOrder.events && currentOrder.events.length > 0 ? (
                  <>
                    <span id="orderDates">{currentOrder.events.length ? `${currentOrder.events.length} event date${currentOrder.events.length > 1 ? 's' : ''}` : ''}</span>
                    <UncontrolledTooltip placement="top" target="orderDates">
                      {currentOrder && currentOrder.events && currentOrder.events.length > 0 ? currentOrder.events.map((event, i) => (
                        <span key={i}>
                          {event ? `${moment(event.date).format('DD/MM/YYYY')}, ` : '' }
                        </span>
                      )) : <small>No events</small>}
                    </UncontrolledTooltip>
                  </>
                ) : <small className="text-danger">No events</small>}

              </div>
            </div> */}
            <div className="checkout-items">{currentOrder && currentOrder.orderLines.length > 0 ? renderCart() : <h4>Your cart is empty</h4>}</div>
          </div>

          <div className="price-details mt-auto">
            <ul className="list-unstyled mb-0">
              {/* <li className="price-detail d-flex justify-content-between">
                <div className="detail-title">Lines Subtotal</div>
                <div className="detail-amt">{currentOrder && currentOrder.orderTotals[0]?.orderLinesSubtotal ? priceFormatter(currentOrder.orderTotals[0].orderLinesSubtotal) : ''}</div>
              </li>
              <li className="price-detail d-flex justify-content-between">
                <div className="detail-title">Order Events</div>
                <div className="detail-amt">{currentOrder && currentOrder.events && currentOrder.events.length ? `x${currentOrder.events.length}` : ''}</div>
              </li> */}
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
                  <div className="detail-amt ">{ priceFormatter(currentOrder.orderTotals[0].orderLateFees)}</div>
                </li>
              ) : '' }
              <li className="price-detail detail-total d-flex justify-content-between">
                <div className="detail-title font-weight-bolder">Total</div>
                <div className="detail-amt font-weight-bolder">{currentOrder && currentOrder.orderTotals[0]?.orderTotal ? priceFormatter(currentOrder.orderTotals[0].orderTotal) : ''}</div>
              </li>
            </ul>
          </div>
        </div>
      </CardBody>
    </Card>

  );
};

export default CartSummary;
