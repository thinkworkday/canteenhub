/* eslint-disable react/jsx-no-undef */
import { useState, useEffect } from 'react';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';

// ** Reactstrap
// import Avatar from '@components/avatar';
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Label, Spinner, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Third Party Components
import { toast } from 'react-toastify';

// ** Utils
import { isObjEmpty } from '@utils';

// ** Store & Actions
import { getMenu, updateMenu } from '@store/actions/menu.actions';

// ** Third Party Components
import classnames from 'classnames';
import {
  HelpCircle, CheckCircle,
} from 'react-feather';
import UILoader from '@components/ui-loader';

// import { Search } from 'react-feather';

const ModalFindGroups = (props) => {
  const dispatch = useDispatch();
  const { selectedRecord } = props;

  const {
    register, errors, handleSubmit, setValue, clearErrors, control,
  } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const handleClose = async () => {
    props.modalToggle();
  };

  const onSubmit = async (data) => {
    setProcessing(true);
    if (isObjEmpty(errors)) {
      // set vendor to current user (logged in as vendor) - if admin then need to manually specify
      try {
        await dispatch(updateMenu(selectedRecord._id, data));
        await dispatch(getMenu(selectedRecord._id));
        toast.success(
          <>
            <CheckCircle className="mr-1 text-success" />
            Record updated
          </>,
        );
        handleClose();
        setProcessing(false);
      } catch (err) {
        if (err.response && err.response.status === 500) {
          setApiErrors({ data: 'Could not upload image. File format error' });
        } else {
          // setApiErrors(err.response ? err.response : { data: err.response.data });
        }
        setProcessing(false);
      }
    }
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility}>
        <ModalHeader toggle={() => props.modalToggle()}>
          Edit Menu Name
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
                  <UILoader blocking={isProcessing}>
                    <CardBody>
                      <Row>
                        <Col sm="12">
                          <FormGroup>
                            <Label className="form-label" for="name">
                              Name*
                            </Label>
                            <Input
                              type="text"
                              placeholder="e.g. My Restaurant Menu"
                              id="name"
                              name="name"
                              defaultValue={selectedRecord.name}
                              className={classnames({ 'is-invalid': errors.name })}
                              innerRef={register({ required: true })}
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="12">

                          <FormGroup>
                            <Label className="form-label" for="description">
                              Description
                            </Label>
                            <Input
                              type="textarea"
                              placeholder=""
                              id="description"
                              name="description"
                              defaultValue={selectedRecord.description}
                              className={classnames({ 'is-invalid': errors.description })}
                              innerRef={register()}
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

export default ModalFindGroups;
