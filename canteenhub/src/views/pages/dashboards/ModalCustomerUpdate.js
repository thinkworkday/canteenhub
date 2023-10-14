/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-undef */
import { useState } from 'react';

// ** Reactstrap
import {
  Card, CardBody, FormGroup, Row, Col, Form, Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { Link } from 'react-router-dom';

// ** Third Party Components
import UILoader from '@components/ui-loader';

const ModalCustomerUpdate = (props) => {
  const handleReject = async () => {
    props.modalToggle();
  };
  const handleNewYearCheck = async () => {
    props.modalToggle();
    props.newYearSchoolCheckAccept();
  };
  return (
    <>
      <Modal isOpen={props.modalVisibility} className=" modal-dialog-centered">
        <ModalHeader>
          Update your Profile for School and Class?
        </ModalHeader>
        <Form>
          <ModalBody className="p-0">
            <Row>
              <Col sm="12">
                <Card className="mb-0">
                  <UILoader>
                    <CardBody>
                      <Row>
                        <Col sm="12">

                          <p>
                            Do you want to continue to update
                            {' '}

                            ?
                          </p>

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

                  <Button.Ripple color="primary" onClick={handleNewYearCheck}>
                    Yes, update
                  </Button.Ripple>

                  <Button.Ripple outline className="ml-1 d-flex" color="primary" onClick={handleReject}>
                    <span>No, reject</span>
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

export default ModalCustomerUpdate;
