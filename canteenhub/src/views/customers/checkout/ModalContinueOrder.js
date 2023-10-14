/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';

// ** Store & Actions
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { deleteCartOrder } from '@store/actions/cart.actions';

// ** Reactstrap
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Input, Form, Button, Spinner, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Utils
import { formatDate } from '@utils';
// ** Third Party Components
import UILoader from '@components/ui-loader';

const ModalFulfill = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { currentOrder } = props;
  const profile = currentOrder && currentOrder.profile ? currentOrder.profile[0] : {};

  // const { group, store, orders } = selectedEvent;

  // console.log(orders);

  // const menuData = selectedMenu ? selectedMenu.menuData.map((obj, i) => ({ value: i, label: String(Object.keys(obj)) })) : [];
  // const menuData = selectedMenu.menuData.map((obj) => ({ value: obj.catName, label: obj.catName }));

  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const handleClose = async () => {
    props.modalToggle();
  };

  // const contextActions = React.useMemo(() => {
  const handleStartOver = async () => {
    setProcessing(true);

    try {
      await dispatch(deleteCartOrder(currentOrder._id));
      history.go(0); // refresh page
      setProcessing(false);
    } catch (err) {
      console.log(err);
      setProcessing(false);
      // setApiErrors(err.response ? err.response : { data: err.response.data });
    }
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility} className=" modal-dialog-centered">
        <ModalHeader>
          Continue previous order?
        </ModalHeader>
        <Form>
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

                          <p>
                            Do you want to continue with a previous order started on
                            {' '}
                            {currentOrder ? formatDate(currentOrder.createdAt) : ''}
                            {profile ? ` for ${profile.firstName}` : ''}
                            ?
                          </p>

                          <small className="" />

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
                <FormGroup className="d-flex mt-1">

                  <Button.Ripple color="primary" onClick={() => handleClose()}>
                    Yes, continue
                  </Button.Ripple>

                  <Button.Ripple outline className="ml-1 d-flex" color="primary" disabled={isProcessing} onClick={handleStartOver}>
                    <span>Start a new order</span>
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

export default ModalFulfill;
