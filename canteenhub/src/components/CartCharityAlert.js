/* eslint-disable jsx-a11y/label-has-associated-control */

// ** Third Party Components
import {
  Alert, Card, CardBody,
} from 'reactstrap';

// ** Utils
import { getInitials, priceFormatter } from '@utils';

const CartSummary = (props) => {
  // ** Props
  const {
    currentOrder,
  } = props;

  // console.log(currentOrder.orderTotals[0]);

  // ** Render cart items
  const renderCharityAlert = () => {
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
        {profileLine.orderLines.map((orderLine, i) => {
          const optionsSelected = orderLine.options.map((x) => x.optionsSelected.map((x) => (x.price ? ` ${x.name} (+$${x.price})` : ` ${x.name}`)));

          console.log('subtotal', orderLine);

          // get the vendor
          return (
            <Alert key={`alert-${i}`} color="secondary">
              <div className="alert-body">
                <span>
                  $
                  {orderLine.subtotal}
                  {' '}
                  of this order will be donated to [CHARITY NAME]
                </span>
              </div>
            </Alert>
          );
        })}

      </div>
    ));
  };

  return (
    <>
      {renderCharityAlert()}
    </>
  );
};

export default CartSummary;
