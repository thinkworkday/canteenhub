/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-plusplus */
// ** React Imports
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// ** Store & Actions
import { useSelector } from 'react-redux';
import { fetchEvent } from '@store/actions/event.actions';

// ** Custom Components
import { DateItem } from '@src/components/DateItem';
import { DisplayStatus } from '@src/components/DisplayStatus';

// ** Third Party Components
// import moment from 'moment';
import {
  X,
} from 'react-feather';
import {
  Button, Modal, ModalBody, Row, Col,
} from 'reactstrap';

import {
  getLoggedUser,
} from '@utils';

// ** Styles Imports
import '@styles/react/libs/react-select/_react-select.scss';
import '@styles/react/libs/flatpickr/flatpickr.scss';

import ModalFooter from 'reactstrap/lib/ModalFooter';
import EventOrders from '../vendors/order-dates/edit/EventOrders';

const ViewEventSidebar = (props) => {
  // ** Props
  const {
    store,
    dispatch,
    open,
    handleViewEventModal,
    selectEvent,
  } = props;

  const loggedUser = getLoggedUser();

  // ** Vars
  const selectedEvent = useSelector((state) => state.events.selectedEvent);
  const eventId = store.selectedEvent._id;
  // const { selectedEvent } = store || {};

  // ** Reset Input Values on Close
  const handleResetInputValues = () => {
    dispatch(selectEvent({}));
  };

  // ** Get data on mount
  useEffect(() => {
    setTimeout(() => {
      if (eventId) {
        dispatch(fetchEvent(eventId));
      }
    }, 100);
  }, [open]);

  return (
    <Modal
      isOpen={open}
      toggle={handleViewEventModal}
      className="modal-lg"
      contentClassName="p-0"
      onClosed={handleResetInputValues}
      modalClassName=""
    >

      <div>
        <X size="18px" className="close" onClick={handleViewEventModal} />
      </div>

      <ModalBody className="flex-grow-1 pb-sm-0 pb-3 pt-1">

        <Col>
          <Row className="align-items-center w-100">
            <DateItem date={selectedEvent.date} />
            <div className="w-50">
              <h4 className="mb-0">{selectedEvent.group?.companyName}</h4>
              <small className="d-block">
                {selectedEvent.store?.storeName}
              </small>

              <div>
                <small className="text-muted mr-1">
                  Delivery:
                  {' '}
                  {selectedEvent.deliveryTime}
                </small>
                <small className="text-muted">
                  |
                </small>
                <small className="text-muted ml-1 mr-1">
                  Cutoff:
                  {' '}
                  {selectedEvent.cutoffPeriod}
                  {' '}
                  hrs
                </small>
              </div>
            </div>
            <div className="ml-auto ">
              <DisplayStatus status={selectedEvent.status} />
            </div>

          </Row>
          <hr className="mb-0 pb-0" />
        </Col>

        <EventOrders selectedEvent={selectedEvent} />
      </ModalBody>

      <ModalFooter>
        <Col>
          <Row>
            <Button.Ripple tag={Link} to={`/${loggedUser.role}/order-dates/edit/${selectedEvent._id}`} className="ml-1" type="submit" color="primary">
              Go to Event Detail
            </Button.Ripple>
            <Button.Ripple className="ml-1" color="secondary" type="reset" onClick={handleViewEventModal} outline>
              Close
            </Button.Ripple>
          </Row>
        </Col>
      </ModalFooter>

    </Modal>
  );
};

export default ViewEventSidebar;
