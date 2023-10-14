/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
// import { push } from 'react-router-redux';
import { useHistory } from 'react-router-dom';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import {
  addMenuItem,
} from '@store/actions/menu.actions';

// ** Reactstrap
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, CustomInput, UncontrolledTooltip, InputGroup, InputGroupText,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Third Party Components
import classnames from 'classnames';
import {
  HelpCircle,
} from 'react-feather';
import UILoader from '@components/ui-loader';
import { store } from '@store/storeConfig/store';

// import { Search } from 'react-feather';

const ModalCreateEditOption = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    register, errors, handleSubmit,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const handleClose = async () => {
    props.modalToggle();
  };

  const onSubmit = async (data) => {
    setApiErrors({});
    // setProcessing(true);

    if (isObjEmpty(errors)) {
      try {
        await dispatch(addMenuItem(data));
        const createdItemId = store.getState().records.selectedRecord._id;
        toast.success('Menu item added');
        // redirect back to List view
        history.push(`/admin/menu-items/edit/${createdItemId}`);
        setProcessing(false);
      } catch (err) {
        console.log(err);
        if (err.response && err.response.status === 500) {
          setApiErrors({ data: 'Could not upload image. File format error' });
        } else {
          setApiErrors(err.response ? err.response : { data: err.response.data });
        }
        setProcessing(false);
      }
    }
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility} className="modal-md">
        <ModalHeader toggle={() => props.modalToggle()}>
          Create menu item
        </ModalHeader>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody className="p-0">

            <Row>
              <Col sm="12">
                <Card className="mb-0">
                  <UILoader blocking={isProcessing}>
                    <CardBody>

                      { apiErrors.data ? (
                        <Alert color="danger">
                          <div className="alert-body">
                            <span>{`Error: ${apiErrors.data}`}</span>
                          </div>
                        </Alert>
                      ) : <></>}

                      <p>
                        <strong>Start by prodiving a name for your menu item </strong>
                        <HelpCircle id="tipTags" size="18px" />
                        <UncontrolledTooltip placement="top" target="tipTags">
                          A menu item could be a single item (e.g. Drink), a configurable item (e.g. Sandwhich with salad options) or a bundle (e.g. Meal Deal with Sandwich, Drink and Side)
                        </UncontrolledTooltip>
                      </p>

                      <Row className="mt-2">
                        <Col sm="12">
                          <FormGroup>
                            <Label className="form-label" for="name">
                              Item Name
                            </Label>
                            <Input
                              type="text"
                              placeholder=""
                              id="name"
                              name="name"
                              className={classnames({ 'is-invalid': errors.name })}
                              innerRef={register({ required: true })}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </UILoader>

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
                    <span>Submit</span>
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

export default ModalCreateEditOption;
