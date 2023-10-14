/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { getMenuItem, updateMenuItem } from '@store/actions/menu.actions';

// ** Reactstrap
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Form, Button, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, ListGroupItem,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';

import { ReactSortable } from 'react-sortablejs';
import {
  Menu,
} from 'react-feather';
import UILoader from '@components/ui-loader';

const ModalRemoveOptionFromItem = (props) => {
  const dispatch = useDispatch();
  const { selectedRecord, selectedOptionGroup } = props;

  const {
    handleSubmit,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  // const [listArr, setListArr] = useState((selectedRecord.options));
  const handleClose = async () => {
    props.modalToggle();
  };

  const onSubmit = async () => {
    // first check that we have Options
    let optionData = selectedRecord.options;
    // console.log('selectedRecord', selectedRecord);
    // console.log('selectedOptionGroup', selectedOptionGroup);

    optionData = optionData.filter((prop) => prop._id !== selectedOptionGroup._id);

    setProcessing(true);
    const options = optionData.map((item) => (item._id));
    try {
      await dispatch(updateMenuItem(selectedRecord._id, { options }));
      // await dispatch(getMenuItem(selectedRecord._id));
      toast.success('Option removed');
      handleClose();
      setProcessing(false);
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setApiErrors({ data: 'Could not upload image. File format error' });
      } else {
        setApiErrors(err.response ? err.response : { data: err.response.data });
      }
      setProcessing(false);
    }
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility}>
        <ModalHeader toggle={() => props.modalToggle()}>
          Remove option from menu item

        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="p-0">

            { apiErrors.data ? (
              <Alert color="danger">
                <div className="alert-body">
                  <span>{`Error: ${apiErrors.data}`}</span>
                </div>
              </Alert>
            ) : <></>}

            <Row>
              <Col sm="12">
                <Card className="mb-0">
                  <CardBody>
                    Are you sure you want to remove option
                    {' '}
                    <strong />
                    {' '}
                    from this menu item?
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </ModalBody>

          <ModalFooter className="justify-content-start">
            <Row>
              <Col sm="12">
                <FormGroup className="d-flex">
                  <Button.Ripple type="submit" className="mr-1 d-flex" color="primary" disabled={isProcessing}>
                    {isProcessing && (
                    <div className="d-flex align-items-center mr-1">
                      <Spinner color="light" size="sm" />
                    </div>
                    )}
                    <span>Yes, Remove</span>
                  </Button.Ripple>
                  <Button.Ripple outline color="flat-secondary" onClick={() => handleClose()}>
                    Cancel
                  </Button.Ripple>
                </FormGroup>
              </Col>
            </Row>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  );
};

export default ModalRemoveOptionFromItem;
