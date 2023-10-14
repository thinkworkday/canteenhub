/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/jsx-no-undef */
import { useState, useCallback, forwardRef } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Store & Actions
import { useDispatch } from 'react-redux';
import { fulfillEvent, fetchEvent } from '@store/actions/event.actions';

// ** Reactstrap
import {
  Alert, Card, CardBody, FormGroup, Row, Col, Form, Button, Spinner, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import DataTable from 'react-data-table-component';

// ** Utils

// ** Third Party Components
import { toast } from 'react-toastify';

import {
  ChevronDown,
} from 'react-feather';
import UILoader from '@components/ui-loader';
import { columns } from './data';

const ModalFulfill = (props) => {
  const dispatch = useDispatch();

  const { selectedEvent } = props;
  const { orders } = selectedEvent;

  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const rowSelectCritera = (row) => row.status === 'active';
  const rowDisabledCriteria = (row) => row.status !== 'active';

  // const {
  //   register, errors, handleSubmit, setValue, clearErrors, control,
  // } = useForm();
  const [apiErrors, setApiErrors] = useState({});
  const [isProcessing, setProcessing] = useState(false);

  const [formVisible, setFormVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();

  const handleClose = async () => {
    props.modalToggle();
    setFormVisible(false);
  };

  // const handleInputChange = (selectedOption) => {
  //   if (selectedOption) {
  //     setSelectedIndex(selectedOption.value);
  //     setFormVisible(true);
  //   }
  // };

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  // ** Bootstrap Checkbox Component
  // eslint-disable-next-line react/display-name
  const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => (
    <div className="custom-control custom-checkbox">
      <input type="checkbox" className="custom-control-input" ref={ref} {...rest} />
      <label className="custom-control-label" onClick={onClick} />
    </div>
  ));

  // const contextActions = React.useMemo(() => {
  const handleFulfillment = async () => {
    setProcessing(true);

    try {
      const ids = selectedRows.map((row) => row._id);
      await dispatch(fulfillEvent(selectedEvent._id, ids));
      await dispatch(fetchEvent(selectedEvent._id));
      await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/events/eventNotification/${selectedEvent._id}`,
        {
          headers,
        })
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.log(e);
        });
      await toast.success('Event successfully fulfilled');
      setProcessing(false);
      handleClose();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Error: ', err);
      setApiErrors(err.response ? err.response : { data: err.response.data });
    }
  };

  return (
    <>

      <Modal isOpen={props.modalVisibility} className="modal-lg">
        <ModalHeader toggle={() => props.modalToggle()}>
          Fulfull event date
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
                          {selectedEvent.store.stripeAccountStatus && selectedEvent.store.stripeAccountStatus === 'active' ? (
                            <>
                              <p>
                                Fulfilling order event dates will close off the event and mark all orders as delivered. You must un-check all orders below that were
                                {' '}
                                <strong>NOT</strong>
                                {' '}
                                fulfilled
                              </p>
                              <DataTable
                                noHeader
                                pagination
                                selectableRows
                                columns={columns}
                                paginationPerPage={10}
                                className="react-dataTable"
                                sortIcon={<ChevronDown size={10} />}
                                paginationDefaultPage={currentPage + 1}
                    // paginationComponent={CustomPagination}
                                data={orders}
                                onSelectedRowsChange={handleRowSelected}
                                selectableRowsComponent={BootstrapCheckbox}
                                selectableRowSelected={rowSelectCritera}
                                selectableRowDisabled={rowDisabledCriteria}
                              />
                            </>
                          ) : (
                            <Alert color="info">
                              <div className="alert-body">
                                <span>{`Error: You cannot fulfill any events until the bank account for store ${selectedEvent.store.storeName} is connected and active`}</span>
                              </div>
                            </Alert>
                          )}
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
                {selectedEvent.store.stripeAccountStatus && selectedEvent.store.stripeAccountStatus === 'active' ? (
                  <>
                    <small className="text-muted d-block">Note: This will close off the event and set all checked orders to fulfilled. Pending orders will be refunded back to the customer. You cannot undo this action. Once fulfilled, your payout will be automatically transferred into your account within 7 business days.</small>
                    <FormGroup className="d-flex mt-1">
                      <Button.Ripple className="mr-1 d-flex" color="primary" disabled={isProcessing} onClick={handleFulfillment}>
                        {isProcessing && (
                        <div className="d-flex align-items-center mr-1">
                          <Spinner color="light" size="sm" />
                        </div>
                        )}
                        <span>Fulfill Order Event</span>
                      </Button.Ripple>

                      <Button.Ripple outline color="flat-secondary" onClick={() => handleClose()}>
                        Cancel
                      </Button.Ripple>
                    </FormGroup>
                  </>
                ) : (
                  <Button.Ripple tag={Link} to="/vendor/stores" color="primary">
                    Connect bank account
                  </Button.Ripple>
                )}
              </Col>

            </Row>

          </ModalFooter>
        </Form>
      </Modal>
    </>

  );
};

export default ModalFulfill;
