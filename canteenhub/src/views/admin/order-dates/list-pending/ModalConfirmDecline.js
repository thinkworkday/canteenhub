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

const ModalConfirmDecline = (props) => {
  const dispatch = useDispatch();
  const [apiErrors, setApiErrors] = useState({});

  const { selectedRows, isSingle } = props;

  const handleClose = async () => {
    props.modalToggle();
  };

  const handleDecline = async () => {
    try {
      const ids = selectedRows.map((row) => row._id);
      await dispatch(updateEventStatus({ ids, status: 'declined' }));
      if (isSingle) {
        await dispatch(fetchEvent(selectedRows[0]._id));
      }
      await dispatch(fetchEvents({}, 'pending'));
      await toast.success('Events updated');
      handleClose();
    } catch (err) {
      setApiErrors(err.response ? err.response : { data: err.response.data });
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
            Are you sure you want to decline the
            {' '}
            {selectedRows.length}
            {' '}
            selected event dates?
          </p>
          <small>Once declined, you cannot undo. The store will be notified of this</small>

        </ModalBody>
        <ModalFooter className="justify-content-start">
          <Button color="primary" onClick={() => handleDecline()}>
            Yes, confirm decline
          </Button>
          <Button.Ripple outline color="secondary" onClick={() => handleClose()}>
            No
          </Button.Ripple>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ModalConfirmDecline;
