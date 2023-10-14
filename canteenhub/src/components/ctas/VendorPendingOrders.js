import { useEffect, useState } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '@store/actions/order.actions';

import {
  Card, CardBody, CardText,
} from 'reactstrap';

import {
  ShoppingBag,
} from 'react-feather';

const CTAApproveOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);

  const [pendingCount, setPendingCount] = useState(0);

  // ** Get data on mount
  useEffect(() => {
    dispatch(getOrders({ status: 'pending', upcoming: true }));
    setPendingCount(orders.data.length);
  }, [orders.data.length]);

  return (
    <>
      {pendingCount > 0 ? (
        <Card className="card-approve-cta">
          <CardBody className="d-flex justify-content-lg-between align-items-center flex-wrap">
            <div className="d-flex align-items-center">
              <div className="card-icon pending" style={{ height: 'fit-content' }}>
                <ShoppingBag />
              </div>
              <div>
                <h6 className="mb-0">
                  {pendingCount}
                  {' '}
                  Pending orders are awaiting your approval
                </h6>
                <CardText><small>These are orders placed after cutoff time</small></CardText>
              </div>
            </div>
            <a href="/vendor/orders/list/?status=pending&upcoming=true" className="waves-effect ml-auto btn btn-primary ">View</a>
          </CardBody>
        </Card>
      ) : ''}

    </>
  );
};

export default CTAApproveOrders;
