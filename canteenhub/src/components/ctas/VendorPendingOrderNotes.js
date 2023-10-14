/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux';
import { getPendingOrderNotes } from '@store/actions/order.actions';

import {
  Card, CardBody, CardText,
} from 'reactstrap';

import {
  Book,
} from 'react-feather';

const VendorPendingOrderNotes = () => {
  const dispatch = useDispatch();
  const orderNotesPending = useSelector((state) => state.orderNotesPending);

  const [pendingNotesCount, setPendingNotesCount] = useState(0);

  // ** Get data on mount
  useEffect(() => {
    dispatch(getPendingOrderNotes());
    setPendingNotesCount(orderNotesPending.data.length);
  }, [orderNotesPending.data.length]);

  return (
    <>
      {pendingNotesCount > 0 ? (
        <Card className="card-approve-cta">
          <CardBody className="d-flex justify-content-lg-between align-items-center flex-wrap">
            <div className="d-flex align-items-center">
              <div className="card-icon pending" style={{ height: 'fit-content' }}>
                <Book />
              </div>
              <div>
                <h6 className="mb-0">
                  {pendingNotesCount}
                  {' '}
                  Pending Modification orders are awaiting your approval
                </h6>
                <CardText><small>These are orders placed with customer's modification</small></CardText>
              </div>
            </div>
            <a href="/vendor/orders/list/?orderNoteStatus=pending" className="waves-effect ml-auto btn btn-primary ">View</a>
          </CardBody>
        </Card>
      ) : ''}

    </>
  );
};

export default VendorPendingOrderNotes;
