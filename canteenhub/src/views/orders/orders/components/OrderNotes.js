// ** React Imports
import { useEffect } from 'react';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';
import { getOrderNotes } from '@store/actions/orderNotes.actions';

// ** Utils

// ** Third Party Components
import {
  Card,
  CardBody,
} from 'reactstrap';

//* * Components
import CardComment from '@src/components/cards/CardComment';

const OrderNotes = () => {
  const dispatch = useDispatch();

  // ** States
  const order = useSelector((state) => state.orders.selectedOrder);
  const orderNotes = useSelector((state) => state.orderNotes.data);

  // ** Get invoice on mount based on id
  useEffect(() => {
    dispatch(getOrderNotes({ orderId: order._id }));
  }, [order._id]);

  return (
    <>
      <Card className="invoice-preview-card mb-2">
        {orderNotes.length > 0 ? (
          <>
            <hr className="invoice-spacing" />
            <CardBody>
              <h5 className="mb-2">Modification(s)</h5>
              { orderNotes.map((note, i) => (
                <CardComment
                  key={i}
                  comment={note}
                  index={i}
                />
              ))}
            </CardBody>
          </>
        ) : ''}
      </Card>
    </>
  );
};

export default OrderNotes;
