// ** React Imports
import { useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { getOrderNotes, addOrderNote } from '@store/actions/orderNotes.actions';
import { useForm } from 'react-hook-form';

// ** Third Party Components
import {
  Modal, ModalBody, ModalFooter, Input, Form, FormGroup, ModalHeader, Button,
} from 'reactstrap';
import { toast } from 'react-toastify';
import UILoader from '@components/ui-loader';

export const ModalOrderNotesResponse = (params) => {
  const dispatch = useDispatch();

  const {
    orderId, noteParent, status, modalConfirmVisibility, setModalConfirmVisibility,
  } = params;

  const {
    register, handleSubmit,
  } = useForm();

  // ** States
  const [isProcessing, setProcessing] = useState(false);

  // ** Handle Form Submit (Add & Edit)
  const handleOrderNoteSubmission = async (data) => {
    setProcessing(true);

    data.order = orderId;
    data.noteParent = noteParent;
    data.status = status;
    try {
      await dispatch(addOrderNote(data));
      await dispatch(getOrderNotes({ orderId }));
      toast.success('Response sent');
      setModalConfirmVisibility(!modalConfirmVisibility);
      setProcessing(false);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      setProcessing(false);
    }
  };

  return (
    <Modal isOpen={modalConfirmVisibility} toggle={() => setModalConfirmVisibility(!modalConfirmVisibility)}>
      <ModalHeader toggle={() => setModalConfirmVisibility(!modalConfirmVisibility)}>
        Review modification
      </ModalHeader>
      <UILoader blocking={isProcessing} className="order-item d-flex justify-content-between">
        <Form
          onSubmit={handleSubmit((data) => {
            handleOrderNoteSubmission(data);
          })}
        >
          <ModalBody>
            {status === 'approved' ? (
              <>
                <p><strong>Approve the requested order modification</strong></p>
                <p>Optional: send a response to the customer regarding the requested order modification</p>
              </>
            ) : (
              <>
                <p><strong>Decline the requested order modification</strong></p>
                <p>Please provide a reason as to why the request is being declined</p>
              </>
            )}
            <FormGroup>
              <Input
                type="textarea"
                placeholder=""
                id="notes"
                name="notes"
                innerRef={register()}
              />
            </FormGroup>
            <small>NOTE: customer will be notified on your response</small>
            {/* <div><strong>{row.email}</strong></div> */}
          </ModalBody>
          <ModalFooter className="justify-content-start">

            <Button color="primary" type="submit">
              {status === 'approved' ? 'Approve' : 'Decline'}
            </Button>
            <Button color="secondary" onClick={() => setModalConfirmVisibility(!modalConfirmVisibility)} outline>
              Cancel / Close
            </Button>
          </ModalFooter>
        </Form>
      </UILoader>
    </Modal>
  );
};
