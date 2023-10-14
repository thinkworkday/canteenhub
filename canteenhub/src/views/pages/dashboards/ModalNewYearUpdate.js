// ** Reactstrap
import {
  Card, CardBody, FormGroup, Row, Col, Form, Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

// ** Third Party Components
import UILoader from '@components/ui-loader';

const ModalNewYearUpdate = (props) => {
  const handleCancel = async () => {
    props.modalToggle();
  };
  const handleNewYearStart = async () => {
    props.modalToggle();
    props.newYearSchoolUpdate();
  };
  return (
    <>
      <Modal isOpen={props.newYearCheckModalVisibility} className=" modal-dialog-centered">
        <ModalHeader>
          Did the New Year School start?
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

                  <Button.Ripple color="primary" onClick={handleNewYearStart}>
                    Yes, started
                  </Button.Ripple>

                  <Button.Ripple outline className="ml-1 d-flex" color="primary" onClick={handleCancel}>
                    <span>No</span>
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

export default ModalNewYearUpdate;
