/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { updateEventStatus, fetchEvents, fetchEvent } from '@store/actions/event.actions';

// ** Reactstrap
import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';

const ModalConfirmApprove = (props) => {
  const dispatch = useDispatch();
  const [apiErrors, setApiErrors] = useState({});

  const { selectedRows, isSingle } = props;

  const handleClose = async () => {
    props.modalToggle();
  };

  const handleApprove = async () => {
    try {
      const ids = selectedRows.map((row) => row._id);
      await dispatch(updateEventStatus({ ids, status: 'active' }));
      if (isSingle) {
        await dispatch(fetchEvent(selectedRows[0]._id));
      }
      await dispatch(fetchEvents({}, 'pending'));
      await toast.success('Events updated');
      handleClose();
      // history.go(0); // refresh page
    } catch (err) {
      setApiErrors(err.response ? err.response : { data: err.response.data });
    }
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
            Please confirm that you are approving the selected
            {' '}
            {selectedRows.length}
            {' '}
            order event date(s)
          </p>
          <small>Once approved, customers who are registered with your school will be able place orders</small>

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
