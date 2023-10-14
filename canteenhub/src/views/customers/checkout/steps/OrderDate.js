// ** React Imports
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// import axios from 'axios';
// import { headers } from '@configs/apiHeaders.js';

// ** Store & Actions
import { updateCartOrder } from '@store/actions/cart.actions';
import { fetchUpcomingEvents } from '@store/actions/event.actions';

// ** Third Party Components
// import AvatarGroup from '@components/avatar-group';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft, ArrowRight, CheckCircle,
} from 'react-feather';
import {
  Alert, Form, Row, Col, Button, Media, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

// ** Utils
import moment from 'moment';
import { getDeliveryDate, getCutOffDate } from '@utils';
import { DateItem } from '@src/components/DateItem';

const MySwal = withReactContent(Swal);

const PersonalInfo = ({ stepper, currentOrder, isNewOrder }) => {
  const dispatch = useDispatch();

  const upcomingEvents = useSelector((state) => state.events);

  // const currentOrderState = useSelector((state) => state.cart.selectedOrder); // needed to update values as state is changed
  // console.log('currentOrderState', currentOrderState);

  const [eventList, setEventList] = useState([]);
  const [eventListObjects, setEventListObjects] = useState([]);
  const [menuList, setMenuList] = useState([]);
  const [menuSelected, setMenuSelected] = useState([]);

  const [step2Errors, setStep2Errors] = useState([]);

  const {
    handleSubmit,
  } = useForm();

  // ** Step change listener on mount
  useEffect(() => {
    if (currentOrder) {
      if (currentOrder.profile[0]._id) {
        dispatch(fetchUpcomingEvents(currentOrder.profile[0]._id));
      }
      if (currentOrder && currentOrder.events) {
        setEventList(isNewOrder ? [] : currentOrder.events.map((event) => (event._id)));
      }
    }
  }, [currentOrder]);

  // ** Event list change listener
  useEffect(() => {
    // setup Menu list
    if (upcomingEvents) {
      const allMenus = upcomingEvents.events.map((event) => (event.menus.length > 0 ? event.menus[0] : event.menuDefault[0]));
      setMenuList(allMenus.filter((value, index, self) => index === self.findIndex((t) => (
        t._id === value._id && t.name === value.name
      ))));
    }
  }, [upcomingEvents]);

  // ** Event list change listener
  useEffect(() => {
    if (menuList.length > 0) {
      setMenuSelected(menuList[0]); // default to the first item
    }
  }, [menuList]);

  const handlePreviousClick = async () => {
    await dispatch(updateCartOrder(currentOrder._id, { currentStep: 1 }));
    stepper.previous();
  };

  const addEventToList = async (event) => {
    setEventList([...eventList, event._id]);
    const eventObj = { _id: event._id, date: event.date };
    setEventListObjects([...eventListObjects, eventObj]);
  };

  const removeEventFromList = async (event) => {
    setEventList(eventList.filter((e) => (e !== event._id)));
    setEventListObjects(eventListObjects.filter((e) => (e._id !== event._id)));
  };

  const handleMenuChange = (menu) => {
    setMenuSelected(menu);
    setEventList([]);
  };

  const handleFooterAlert = () => MySwal.fire({
    icon: 'info',
    text: 'Order cutoff has passed. Orders can not longer be placed for this event',
    customClass: {
      confirmButton: 'btn btn-primary',
    },
    showClass: {
      popup: 'animate__animated animate__fadeIn',
    },
    buttonsStyling: false,
  });

  const handleEventClick = async (eventActive, isDisabled, event) => {
    if (isDisabled) {
      handleFooterAlert();
    } else {
      !eventActive ? addEventToList(event) : removeEventFromList(event);
    }
  };

  const onSubmit = async () => {
    if (!eventList || eventList.length === 0) {
      await setStep2Errors([{ error: 'no profile selected' }]);
    } else {
      // Create or Update Order (if Continueing)
      try {
        await dispatch(updateCartOrder(currentOrder._id, { events: eventList, currentMenu: menuSelected._id, currentStep: 3 }));
        stepper.next();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('ERROR', err);
        // setApiErrors(err.response ? err.response : { data: err.response.data });
      }
    }
  };

  const renderUpcomingEvents = (upcomingEvents, selectedEvents) => {
    const eventComponents = upcomingEvents.events.map((event, i) => {
      const deliveryDate = getDeliveryDate(event.date, event.deliveryTime);
      const cutoffDate = getCutOffDate(deliveryDate, event.cutoffPeriod, true);
      const cutoffDateRaw = getCutOffDate(deliveryDate, event.cutoffPeriod, false);

      const menu = event.menus && event.menus.length > 0 ? event.menus[0] : event.menuDefault[0];

      // check if order cutoff has passed
      const eventActive = selectedEvents && selectedEvents.includes(event._id) ? 'active' : '';
      const disabledClass = menu._id === menuSelected._id ? '' : 'disabled';
      // const isDisabled = !!isInThePast(new Date(cutoffDateRaw));
      const isDisabled = false;

      return (
        <Row key={`event-${event._id}`}>
          <Col md="12">
            <div role="button" tabIndex={i} className={classnames('btn-row-2', 'd-flex', 'justify-content-between', 'align-items-center', eventActive, disabledClass)} onClick={() => handleEventClick(eventActive, isDisabled, event)} onKeyDown={() => handleEventClick(eventActive, isDisabled, event)}>

              <Media className="align-items-top w-100">
                <DateItem date={event.date} />
                <Media body className="mr-1">

                  <Row className="justify-content-start">
                    <Col sm={6} md={4} lg={3}>
                      <h6 className="transaction-title">{event.title}</h6>
                      <p className="mb-25">
                        Menu:
                        {' '}
                        {menu.name}
                      </p>
                    </Col>
                    <Col>
                      <small className="d-block">{event.store.storeName}</small>
                      <small className="d-block">
                        Delivery:
                        {' '}
                        {deliveryDate}
                      </small>
                      <small className="d-block">
                        {
                      moment(cutoffDateRaw).isAfter() ? `Orders cutoff ${cutoffDate}` : (
                        <strong className="text-primary">
                          {`Order cutoff date was ${cutoffDate}. You can still place an order, however the store will need to approve`}
                        </strong>
                      )
                      }
                      </small>
                    </Col>
                  </Row>
                </Media>
                {/* <Media body className="mr-2">
                  <small className="d-block text-info">21 people have ordered</small>
                </Media> */}
              </Media>
              <CheckCircle size={36} className="check-notificaiton d-none" />

              {/* <div className="d-none d-sm-flex">
                { !eventActive ? (
                  <Button.Ripple color="aero" outline className="btn-prev mr-1 btn-sm" onClick={() => addEventToList(event)}>
                    <span className="align-middle ">
                      Select
                    </span>
                  </Button.Ripple>
                ) : (
                  <Button.Ripple color="aero" className="btn-prev mr-1 btn-sm " onClick={() => removeEventFromList(event)}>
                    <span className="align-middle ">
                      <CheckCircle size={14} className="align-middle mr-sm-25 mr-0" />
                      Selected
                    </span>
                  </Button.Ripple>
                )}
              </div> */}
            </div>
          </Col>
        </Row>
      );
    });

    return eventComponents;
  };

  // console.log('upcomingEvents', upcomingEvents);

  return (
    <>
      <Row className=" mb-2 d-flex justify-content-between">
        <Col lg={4}>
          <h3 className="mb-1">
            Upcoming Events
          </h3>
          <small className="text-muted d-block">Please select the dates you would like to place this order for. You may select multiple, however the menu must be the same menu for orderline.</small>
        </Col>
        <Col lg={6} className="d-flex justify-content-end align-items-end">
          {eventList.length > 0 ? (
            <p className="text-success m-0">
              {`${eventList.length} date`}
              {eventList.length === 1 ? '' : 's'}
              {' selected'}
            </p>
          ) : '' }
        </Col>
      </Row>
      <hr className="mb-2" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        {step2Errors.length > 0 ? (
          <Alert color="primary">
            <div className="alert-body">
              <span>You must select at least one order / event date</span>
            </div>
          </Alert>
        ) : <></>}

        {/* <ul className="nav-pill-light nav-pill-sm my-2 mb-3 nav nav-pills">
          {
          menuList.map((menu, index) => {
            console.log(menu);
            return (<li key={`menu-${index}`} className="nav-item"><div className="nav-link">{menu.name}</div></li>);
          })
        }
        </ul> */}

        <UncontrolledButtonDropdown>
          <DropdownToggle color="primary" className="mb-1" outline caret>
            Menu:
            {' '}
            {menuSelected ? menuSelected.name : ''}
          </DropdownToggle>
          <DropdownMenu>
            {
              menuList.map((menu, index) => (<DropdownItem key={`menu-${index}`} onClick={() => handleMenuChange(menu)}>{menu.name}</DropdownItem>))
            }
          </DropdownMenu>
        </UncontrolledButtonDropdown>

        {upcomingEvents && upcomingEvents.events.length > 0 ? (
          renderUpcomingEvents(upcomingEvents, eventList)
        ) : (
          <Alert color="info">
            <div className="alert-body">
              <span>Your selected profile does not have any upcoming events. Events are setup by schools and stores. If you feel this is incorrect, please contact us.</span>
            </div>
          </Alert>
        ) }

        <div className="action-wrapper d-flex justify-content-center mt-3">
          <Button.Ripple color="primary" outline className="btn-prev mr-1" onClick={() => handlePreviousClick()}>
            <ArrowLeft size={14} className="align-middle mr-sm-25 mr-0" />
            <span className="align-middle">Back</span>
          </Button.Ripple>
          <Button.Ripple type="submit" color="primary" className="btn-next">
            <span className="align-middle">Continue</span>
            <ArrowRight size={14} className="align-middle ml-sm-25 ml-0" />
          </Button.Ripple>
        </div>
      </Form>
    </>
  );
};

export default PersonalInfo;
