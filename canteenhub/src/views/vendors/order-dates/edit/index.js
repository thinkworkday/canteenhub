/* eslint-disable radix */
// ** React Imports
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// ** Store & Actions
import { useSelector, useDispatch } from 'react-redux';

// ** Reactstrap
import {
  Button, Row, Col, Alert, Card, CardBody,
} from 'reactstrap';

import { fetchEvent } from '@store/actions/event.actions';

// ** Components
import { DisplayStatus } from '@src/components/DisplayStatus';

// ** User View Components
// import { getLoggedUser } from '@utils';
import EventDetails from './EventDetails';
import EventOrders from './EventOrders';

import ModalFulfill from './ModalFulfill';
import ModalPrintLabels from './ModalPrintLabels';

// ** Styles
import '@styles/react/apps/app-users.scss';

const StoreView = () => {
  // ** Vars
  const selectedEvent = useSelector((state) => state.events.selectedEvent);
  const dispatch = useDispatch();
  const { id } = useParams();

  // console.log('selectedEvent from LIST', selectedEvent);

  const [enableSave, setEnableSave] = useState(false);

  const [modalFulfillVisibility, setModalFulfillVisibility] = useState(false);
  const toggleFulfillModal = () => { setModalFulfillVisibility(!modalFulfillVisibility); };

  const [modalPrintLabelsVisibility, setModalPrintLabelsVisibility] = useState(false);
  const togglePrintLabelsModal = () => { setModalPrintLabelsVisibility(!modalPrintLabelsVisibility); };

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
            <div className="d-flex align-items-center ml-auto">
              <span className="title mr-1">Status:</span>
              <DisplayStatus status={selectedEvent.status} />
            </div>
          </div>
        </Col>
        <Col lg={3} />
      </Row>

      <Row className="invoice-edit">
        <Col sm={9}>
          <EventDetails selectedEvent={selectedEvent} enableSave={enableSave} setEnableSave={setEnableSave} />
          <EventOrders selectedEvent={selectedEvent} />
        </Col>

        <Col lg={3}>
          <Card className="invoice-action-wrapper">
            <CardBody>

              <Button.Ripple type="submit" form="formEventEdit" color="primary" block className="mb-2" disabled={!enableSave}>
                Save Changes
              </Button.Ripple>

              <Button.Ripple
                color="primary"
                block
                outline
                className="mb-75"
                // disabled={selectedEvent.status !== 'active'}
                onClick={() => {
                  togglePrintLabelsModal();
                }}
              >
                Print Order Labels
              </Button.Ripple>

              <Button.Ripple
                color="primary"
                block
                outline
                className="mb-75"
                disabled={selectedEvent.status !== 'active'}
                onClick={() => {
                  toggleFulfillModal();
                }}
              >
                Fulfill Order Event
              </Button.Ripple>

            </CardBody>
          </Card>
        </Col>
      </Row>

      <ModalFulfill modalVisibility={modalFulfillVisibility} modalToggle={() => toggleFulfillModal()} selectedEvent={selectedEvent} />
      <ModalPrintLabels modalVisibility={modalPrintLabelsVisibility} modalToggle={() => togglePrintLabelsModal()} selectedEvent={selectedEvent} />

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
