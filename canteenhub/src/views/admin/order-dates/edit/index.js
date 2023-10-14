/* eslint-disable radix */
// ** React Imports
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

// ** Reactstrap
import {
  Button, Row, Col, Alert, CardText, Card, CardBody, CardTitle,
} from 'reactstrap';

import { fetchEvent } from '@store/actions/event.actions';

// ** Components
import ModalConfirmApprove from '../list-pending/ModalConfirmApprove';
import ModalConfirmDecline from '../list-pending/ModalConfirmDecline';

// ** User View Components
import EventDetails from './EventDetails';
import EventOrders from './EventOrders';

// ** Styles
import '@styles/react/apps/app-users.scss';

const StoreView = () => {
  // ** Vars
  const selectedEvent = useSelector((state) => state.events.selectedEvent);
  const dispatch = useDispatch();
  const { id } = useParams();

  const [enableSave, setEnableSave] = useState(false);

  const [modalConfirmVisibility, setModalConfirmVisibility] = useState(false);
  const [modalDeclineVisibility, setModalDeclineVisibility] = useState(false);

  const toggleConfirmModal = () => {
    setModalConfirmVisibility(!modalConfirmVisibility);
  };

  const toggleDeclineModal = () => {
    setModalDeclineVisibility(!modalDeclineVisibility);
  };

  // ** Get data on mount
  useEffect(() => {
    dispatch(fetchEvent(id));
  }, [dispatch]);

  return selectedEvent !== null && selectedEvent !== undefined && selectedEvent._id ? (
    <div className="app-user-view">

      <Row className="invoice-edit">
        <Col sm={9}>
          <div className="table-header d-flex justify-content-between align-items-bottom">
            <div>
              <Button.Ripple color="flat-light" onClick={() => window.history.back()}>
                &lt; back to list
              </Button.Ripple>
              <h3>
                Order Event
              </h3>
            </div>
          </div>
        </Col>
        <Col lg={3} />
      </Row>

      {selectedEvent.status === 'pending' ? (
        <Card className="card-approve-cta">
          <CardBody className="d-flex justify-content-lg-between align-items-center bg-warning-light">
            <div>
              <h6 className="mb-0">
                Awaiting your approval
              </h6>
              <CardText><small>Customers will not be able to order on this event until it is approved</small></CardText>
            </div>

            <div className="actionButtons">
              <Button.Ripple
                size="sm"
                color="success"
                className="mr-1"
                onClick={() => toggleConfirmModal()}
              >
                Approve
              </Button.Ripple>

              <Button.Ripple
                size="sm"
                color="danger"
                outline
                onClick={() => toggleDeclineModal()}
              >
                Decline
              </Button.Ripple>
            </div>
            <ModalConfirmApprove modalVisibility={modalConfirmVisibility} modalToggle={() => toggleConfirmModal()} selectedRows={[selectedEvent]} isSingle />
            <ModalConfirmDecline modalVisibility={modalDeclineVisibility} modalToggle={() => toggleDeclineModal()} selectedRows={[selectedEvent]} isSingle />
          </CardBody>
        </Card>
      ) : ''}

      <Row className="invoice-edit">
        <Col sm={9}>
          <EventDetails selectedEvent={selectedEvent} enableSave={enableSave} setEnableSave={setEnableSave} />
          <EventOrders selectedEvent={selectedEvent} />
        </Col>

        <Col lg={3}>
          <Card className="invoice-action-wrapper">
            <CardBody>
              <CardTitle>Group Details</CardTitle>
              <Row className="invoice-spacing justify-content-between">
                <Col className="p-0 mt-xl-0 mt-0">
                  { selectedEvent && selectedEvent.group ? (
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <p className="mb-0 text-sm">
                              {selectedEvent.group.companyName ? selectedEvent.group.companyName : ''}
                            </p>
                            <p className="mb-0 text-sm">
                              {selectedEvent.group.firstName ? `${selectedEvent.group.firstName} ${selectedEvent.group.lastName}` : ''}
                            </p>
                            <p className="mb-0 text-sm">
                              e:
                              {' '}
                              {selectedEvent.group.email ? selectedEvent.group.email : ''}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : '' }
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card className="invoice-action-wrapper">
            <CardBody>
              <CardTitle>Store Details</CardTitle>
              <Row className="invoice-spacing justify-content-between">
                <Col className="p-0 mt-xl-0 mt-0">
                  { selectedEvent && selectedEvent.store ? (
                    <table>
                      <tbody>
                        <tr>
                          <td>
                            <p className="mb-0 text-sm">
                              {selectedEvent.store.storeName ? selectedEvent.store.storeName : ''}
                            </p>
                            <p className="mb-0 text-sm">
                              e:
                              {' '}
                              {selectedEvent.store.storeEmail ? selectedEvent.store.storeEmail : ''}
                            </p>
                            <p className="mb-0 text-sm">
                              p:
                              {' '}
                              {selectedEvent.store.storePhone ? selectedEvent.store.storePhone : ''}
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : '' }
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">Event not found</h4>
      <div className="alert-body">
        {`Event with id: ${id} does not exist `}
        <Link to="/stores">Back to Events List</Link>
      </div>
    </Alert>
  );
};
export default StoreView;
