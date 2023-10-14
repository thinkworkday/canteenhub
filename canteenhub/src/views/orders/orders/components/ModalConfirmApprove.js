/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
// import { updateEventStatus, fetchEvents, fetchEvent } from '@store/actions/event.actions';
import { getOrder, updateOrder } from '@store/actions/order.actions';

import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Reactstrap
import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Third Party Components

const ModalConfirmApprove = (props) => {
  const dispatch = useDispatch();
  const [apiErrors, setApiErrors] = useState({});

  const { order } = props;

  const handleClose = async () => {
    props.modalToggle();
  };

  const handleApprove = async () => {
    await dispatch(updateOrder(order._id, { status: 'active' }));
    await dispatch(getOrder(order.orderNumber));

    // Send email
    const data = {
      recipientEmail: order.customer.email,
      subject: 'Your pending order has been approved',
      content: `Order number ${order.orderNumber} has been approved by the vendor and will be dispatched on the defined order date`,
      btnText: 'View Order',
      btnUrl: `${process.env.REACT_APP_SITE_URL}/customer/order/edit/${order.orderNumber}`,
    };
    await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/notifications/sendNotification/`, data, {
      headers,
    }).catch((err) => {
      throw err;
    });
    props.modalToggle();
  };

  return (
    <>
      <Modal isOpen={props.modalVisibility} toggle={() => props.modalToggle()}>
        <ModalHeader toggle={() => props.modalToggle()}>Confirm approval</ModalHeader>
        <ModalBody>
          { apiErrors.data ? (
            <Alert color="danger">
              <div className="alert-body">
                <span>{`Error: ${apiErrors.data}`}</span>
              </div>
            </Alert>
          ) : <></>}

          <p className="mb-0">
            Please confirm that you are approving the pending order. By approving, you are commiting to fulfilling the order for the customer.
          </p>
          <small>Once approved, the customer will be notified. This action cannot be undone</small>

        </ModalBody>
        <ModalFooter className="justify-content-start">
          <Button color="primary" onClick={() => handleApprove()}>
            Yes, approve
          </Button>
          <Button.Ripple outline color="secondary" onClick={() => handleClose()}>
            No
          </Button.Ripple>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ModalConfirmApprove;
