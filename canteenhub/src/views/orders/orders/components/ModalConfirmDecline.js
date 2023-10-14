/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { cancelOrder } from '@store/actions/order.actions';

// ** Reactstrap
import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner,
} from 'reactstrap';

// ** Third Party Components
const ModalConfirmDecline = (props) => {
  const dispatch = useDispatch();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const { order } = props;

  const handleClose = async () => {
    props.modalToggle();
  };

  const handleDecline = async () => {
    setProcessing(true);

    // Cancel Order
    try {
      await dispatch(cancelOrder(order._id, setApiErrors));
      window.location.reload(false);
      setProcessing(false);
    } catch (err) {
      // setApiErrors(err.raw.message);

      // eslint-disable-next-line no-console
      console.log('ERROR', err);
      setProcessing(false);
    }
  };

  return (
    <>
      <Modal isOpen={props.modalVisibility} toggle={() => props.modalToggle()}>
        <ModalHeader toggle={() => props.modalToggle()}>Confirm decline</ModalHeader>
        <ModalBody>
          { apiErrors.data ? (
            <Alert color="danger">
              <div className="alert-body">
                <span>{`Error: ${apiErrors.data}`}</span>
              </div>
            </Alert>
          ) : <></>}

          <p className="mb-0">
            Are you sure you want to decline this order? By declining, the customer will not receive the order and will be refunded.
          </p>
          <small>Once declined, you cannot undo.</small>

        </ModalBody>
        <ModalFooter className="justify-content-start">

          <Button.Ripple type="submit" className="mr-1 d-flex" color="primary" disabled={isProcessing} onClick={() => handleDecline()}>
            {isProcessing && (
            <div className="d-flex align-items-center mr-1">
              <Spinner color="light" size="sm" />
            </div>
            )}
            <span>Yes, confirm decline</span>
          </Button.Ripple>

          <Button.Ripple outline color="secondary" onClick={() => handleClose()}>
            No
          </Button.Ripple>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ModalConfirmDecline;
