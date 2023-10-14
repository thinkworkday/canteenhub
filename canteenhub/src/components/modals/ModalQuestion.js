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
import parentImg from '@src/assets/images/pages/parent.png';
import storeImg from '@src/assets/images/pages/store.png';

const ModalQuestion = (props) => {
  const handleModal = async () => {
    props.modalToggle();
  };

  return (
    <>
      <Modal isOpen={props.modalVisibility} toggle={handleModal} className=" modal-dialog-centered">
        <ModalHeader>
          Questions
        </ModalHeader>
        <Form>
          <ModalBody className="p-0">
            <Row className="my-2">
              <Col sm="12">
                <Card className="mb-0">
                  <UILoader>
                    <CardBody>
                      <Row>
                        <Col sm="6">
                          <a href="https://parentsupport.canteenhub.com/portal/">
                            <div className="button-box">
                              <div className="d-flex justify-content-center">
                                <img className="img-responsive question-img" src={parentImg} alt="Parent" />
                              </div>
                              <div className="d-flex justify-content-center mt-2">
                                <span className="question-title">Are you a Parent?</span>
                              </div>
                            </div>
                          </a>
                        </Col>
                        <Col sm="6">
                          <a href="https://vendorsupport.canteenhub.com/portal/">
                            <div className="button-box">
                              <div className="d-flex justify-content-center">
                                <img className="img-responsive question-img" src={storeImg} alt="Parent" />
                              </div>
                              <div className="d-flex justify-content-center mt-2">
                                <span className="question-title">Are you a Vendor?</span>
                              </div>
                            </div>
                          </a>
                        </Col>
                      </Row>
                    </CardBody>
                  </UILoader>
                </Card>
              </Col>
            </Row>
          </ModalBody>
        </Form>
      </Modal>
    </>

  );
};

export default ModalQuestion;
