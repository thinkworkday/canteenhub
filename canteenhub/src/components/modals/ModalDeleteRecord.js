/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { updateRecord } from '@store/actions/record.actions';

// ** Reactstrap
import {
  Alert, Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';

const ModalDeleteRecord = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [apiErrors, setApiErrors] = useState({});

  const handleClose = async () => {
    props.modalToggle();
  };

  const handleDelete = async () => {
    try {
      await dispatch(updateRecord(`${props.recordId}`, `${props.recordSource}`, { status: 'deleted' }));
      await toast.success('Record sent to trash');
      history.go(0); // refresh page
    } catch (err) {
      setApiErrors(err.response ? err.response : { data: err.response.data });
    }
  };

  return (
    <>
      <Modal isOpen={props.modalVisibility} toggle={() => props.modalToggle()}>
        <ModalHeader toggle={() => props.modalToggle()}>Confirm Delete?</ModalHeader>
        <ModalBody>
          { apiErrors.data ? (
            <Alert color="danger">
              <div className="alert-body">
                <span>{`Error: ${apiErrors.data}`}</span>
              </div>
            </Alert>
          ) : <></>}
          <h5>Are you sure you want to delete?</h5>
          <small className="text-danger">This action cannot be undone</small>
        </ModalBody>
        <ModalFooter className="justify-content-start">
          <Button color="primary" onClick={() => handleDelete()}>
            Yes, Please Delete
          </Button>
          <Button.Ripple outline color="secondary" onClick={() => handleClose()}>
            No
          </Button.Ripple>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ModalDeleteRecord;
