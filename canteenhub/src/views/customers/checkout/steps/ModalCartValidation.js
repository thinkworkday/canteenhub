import {
  Card, CardBody, CardText, Modal, ModalBody, ModalHeader,
} from 'reactstrap';

const ModalCartValidation = (props) => (
  <Modal isOpen={props.modalVisibility} className="modal-dialog-centered">
    <ModalHeader className="justify-content-center" toggle={() => props.modalToggle()}>Cart Validation</ModalHeader>
    <ModalBody className="p-0">
      <Card className="card-add-to-cart">
        <CardBody>
          <CardText>
            <h4 className="text-primary">
              You must select the mandatory items for order.
            </h4>
          </CardText>
        </CardBody>
      </Card>
    </ModalBody>
  </Modal>
);

export default ModalCartValidation;
