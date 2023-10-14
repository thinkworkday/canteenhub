// ** React Imports
import { Fragment, useState } from 'react';
// import { Link } from 'react-router-dom';
import { headers } from '@configs/apiHeaders.js';

import { useDispatch } from 'react-redux';

import axios from 'axios';

import classnames from 'classnames';
import { cancelOrder } from '@store/actions/order.actions';
import { addOrderNote, getOrderNotes } from '@store/actions/orderNotes.actions';
import { useForm } from 'react-hook-form';

// ** Third Party Components
import {
  Alert, Card, CardBody, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Form, FormGroup,
} from 'reactstrap';
import { toast } from 'react-toastify';
import UILoader from '@components/ui-loader';

import { getLoggedUser, priceFormatter, isInThePast } from '@utils';
import { Printer } from 'react-feather';

// ** Components
import ModalConfirmApprove from '../components/ModalConfirmApprove';
import ModalConfirmDecline from '../components/ModalConfirmDecline';

// const PDFDocument = require('pdfkit');
// const fs = require('fs');

const EditActions = ({ order }) => {
  const loggedUser = getLoggedUser();
  const dispatch = useDispatch();

  const {
    register, errors, handleSubmit,
  } = useForm();

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [modalCancelVisibility, setModalCancelVisibility] = useState(false);
  const [modalOrderNotesVisibility, setModalOrderNotesVisibility] = useState(false);

  const [modalConfirmVisibility, setModalConfirmVisibility] = useState(false);
  const [modalDeclineVisibility, setModalDeclineVisibility] = useState(false);

  const toggleConfirmModal = () => {
    setModalConfirmVisibility(!modalConfirmVisibility);
  };

  const toggleDeclineModal = () => {
    setModalDeclineVisibility(!modalDeclineVisibility);
  };

  const refundableAmount = priceFormatter(order.orderTotals[0].orderLinesSubtotal);

  const printLabel = async (orderIds) => {
    // const { _id } = record;
    const data = JSON.stringify({
      orderIds,
    });
    axios(`${process.env.REACT_APP_SERVER_URL}/api/orders/printLabels/`, {
      method: 'POST',
      headers,
      responseType: 'blob', // Force to receive data in a Blob Format
      data,
    })
      .then((response) => {
        // Create a Blob from the PDF Stream
        const file = new Blob(
          [response.data],
          { type: 'application/pdf' }
        );
        // Build a URL from the file
        const fileURL = URL.createObjectURL(file);
        // Open the URL on new Window
        window.open(fileURL);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  // ** Handle Form Submit (Add & Edit)
  const handleOrderNoteSubmission = async (data) => {
    setProcessing(true);

    // data.customer = loggedUser._id;
    // data.allergies = data.allergies.map((allergy) => allergy.label);
    data.order = order._id;

    try {
      await dispatch(addOrderNote(data));
      await dispatch(getOrderNotes({ orderId: order._id }));
      toast.success('Request sent');
      setModalOrderNotesVisibility(!modalOrderNotesVisibility);
      setProcessing(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      // if (err.response && err.response.status === 500) {
      //   setApiErrors({ data: 'Could not upload image. File format error' });
      // } else {
      //   setApiErrors(err.response ? err.response : { data: err.response.data });
      // }
      setProcessing(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    setProcessing(true);

    // Update Order
    try {
      await dispatch(cancelOrder(orderId, setApiErrors));
      // console.log('handleCancelOrder close modal');
      setModalCancelVisibility(!modalCancelVisibility);

      // // await dispatch(getOrder(currentOrder.orderNumber));
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
      <Card className="invoice-action-wrapper">
        <CardBody>
          {/* <Button.Ripple color="primary" block className="mb-75" onClick={() => setSendSidebarOpen(true)}>
          Save
        </Button.Ripple> */}

          {/* <Button.Ripple tag={Link} to="/apps/invoice/preview" color="secondary" block outline className="mb-75">
            <Truck size={16} />
            {' '}
            Mark as Delivered
          </Button.Ripple> */}

          {loggedUser.role === 'admin' || loggedUser.role === 'vendor' || loggedUser.role === 'store' ? (
            <>
              {order.status === 'pending' ? (
                <>
                  <Button.Ripple
                    color="success"
                    block
                    outline
                    className="mb-75"
                    onClick={() => setModalConfirmVisibility(!modalConfirmVisibility)}
                  >
                    Approve Order
                  </Button.Ripple>
                  <Button.Ripple
                    color="primary"
                    block
                    outline
                    className="mb-75"
                    onClick={() => setModalDeclineVisibility(!modalDeclineVisibility)}
                  >
                    Decline & Refund
                  </Button.Ripple>
                  <ModalConfirmApprove modalVisibility={modalConfirmVisibility} modalToggle={() => toggleConfirmModal()} order={order} />
                  <ModalConfirmDecline modalVisibility={modalDeclineVisibility} modalToggle={() => toggleDeclineModal()} order={order} />
                </>
              ) : (
                <Button.Ripple color="primary" block outline className="mb-75" onClick={() => printLabel([order._id])}>
                  <Printer size={16} />
                  {' '}
                  Print Label
                </Button.Ripple>
              )}

            </>
          ) : '' }

          {(loggedUser.role === 'customer' && !isInThePast(order.event.deliveryDateTimeUTC)) || loggedUser.role === 'admin' ? (
            <>
              <Button.Ripple
                color="primary"
                block
                outline
                className="mb-75"
                onClick={() => setModalOrderNotesVisibility(!modalOrderNotesVisibility)}
                disabled={order.status !== 'active'}
              >
                Modify Order
              </Button.Ripple>

              <Modal isOpen={modalOrderNotesVisibility} toggle={() => setModalOrderNotesVisibility(!modalOrderNotesVisibility)}>
                <ModalHeader toggle={() => setModalCancelVisibility(!modalOrderNotesVisibility)}>Modify order?</ModalHeader>
                <UILoader blocking={isProcessing} className="order-item d-flex justify-content-between">
                  <Form
                    onSubmit={handleSubmit((data) => {
                      handleOrderNoteSubmission(data);
                    })}
                  >
                    <ModalBody>
                      { apiErrors.data ? (
                        <Alert color="danger">
                          <div className="alert-body">
                            <span>{`Error: ${apiErrors.data}`}</span>
                          </div>
                        </Alert>
                      ) : <></>}
                      <p><strong>Please add a note to modify your order</strong></p>
                      <p>
                        Requests will be sent to the participating store for review
                      </p>
                      <FormGroup>
                        <Input
                          type="textarea"
                          placeholder=""
                          id="notes"
                          name="notes"
                          className={classnames({ 'is-invalid': errors.notes })}
                          innerRef={register({ required: true })}
                        />
                      </FormGroup>
                      <small>NOTE: stores reserve the right to reject the order modification request</small>
                      {/* <div><strong>{row.email}</strong></div> */}
                    </ModalBody>
                    <ModalFooter className="justify-content-start">
                      <Button color="primary" type="submit">
                        Send modification to store
                      </Button>
                      <Button color="secondary" onClick={() => setModalOrderNotesVisibility(!modalOrderNotesVisibility)} outline>
                        Cancel / Close
                      </Button>
                    </ModalFooter>
                  </Form>
                </UILoader>
              </Modal>

              <Button.Ripple
                color="primary"
                block
                outline
                className="mb-75"
                onClick={() => setModalCancelVisibility(!modalCancelVisibility)}
                disabled={order.status !== 'active' || (loggedUser.role === 'customer' && isInThePast(order.event.cutoffDateTimeUTC))}
              >
                Cancel & Refund
              </Button.Ripple>

              { loggedUser.role === 'customer' && isInThePast(order.event.cutoffDateTimeUTC) ? <small className="text-center d-block">Order cutoff has passed. Refunds cannot be processed</small> : (
                <Modal isOpen={modalCancelVisibility} toggle={() => setModalCancelVisibility(!modalCancelVisibility)}>
                  <ModalHeader toggle={() => setModalCancelVisibility(!modalCancelVisibility)}>Cancel and refund the order?</ModalHeader>
                  <UILoader blocking={isProcessing}>
                    <ModalBody>
                      { apiErrors.data ? (
                        <Alert color="danger">
                          <div className="alert-body">
                            <span>{`Error: ${apiErrors.data}`}</span>
                          </div>
                        </Alert>
                      ) : <></>}
                      <p><strong>Are you sure you want to cancel and refund this order?</strong></p>
                      <p>
                        {refundableAmount}
                        {' '}
                        will be refunded directly into your method of payment
                      </p>

                      <small>NOTE: transaction fees are non-refundable</small>

                      {/* <div><strong>{row.email}</strong></div> */}
                    </ModalBody>
                    <ModalFooter className="justify-content-start">
                      <Button color="primary" onClick={() => handleCancelOrder(order._id)}>
                        Yes, Please Cancel
                      </Button>
                      <Button color="secondary" onClick={() => setModalCancelVisibility(!modalCancelVisibility)} outline>
                        No
                      </Button>
                    </ModalFooter>
                  </UILoader>
                </Modal>
              )}
            </>
          ) : (
            <Alert color="info">
              <div className="alert-body">
                <span>Order delivery date has passed. Order cannot be modified.</span>
              </div>
            </Alert>
          )}

          {/* <Button.Ripple color="primary" block outline className="mb-75">
          Save
        </Button.Ripple>
        <Button.Ripple color="success" block onClick={() => setAddPaymentOpen(true)}>
          Add Payment
        </Button.Ripple> */}
        </CardBody>
      </Card>
    </>
  );
};

export default EditActions;
