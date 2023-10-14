/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// ** React Imports
import { Fragment, useState, useEffect } from 'react';

// ** Third Party Components
import {
  Row, Col, Button, FormGroup,
} from 'reactstrap';
import Select from 'react-select';
import moment from 'moment';

// ** Store & Actions
import { getLoggedUser } from '@utils';

// ** Calendar App Component Imports
import { useSelector, useDispatch } from 'react-redux';

import { useForm } from 'react-hook-form';
// import { compareByFieldSpec } from '@fullcalendar/react';
import classnames from 'classnames';
import { getStores } from '@store/actions/vendor.actions';
// import { conditionallyUpdateScrollbar } from 'reactstrap/lib/utils';
import {
  fetchEvents,
  selectEvent,
  updateEvent,
  updateFilter,
  updateAllFilters,
  addEvent,
  removeEvent,
} from './store/actions/index';
import SidebarLeft from './SidebarLeft';
import Calendar from './Calendar';
import AddEventSidebar from './AddEventSidebar';
import ViewEventModal from './ViewEventModal';

// ** Custom Hooks

// ** Styles
import '@styles/react/apps/app-calendar.scss';

// ** CalendarColors
const calendarsColor = {
  active: 'success',
  declined: 'danger',
  pending: 'warning',
  deleted: 'light',
  fulfilled: 'info',
};

const CalendarComponent = () => {
  // ** Variables
  const dispatch = useDispatch();
  const store = useSelector((state) => state.events);
  const stores = useSelector((state) => state.stores);

  const loggedUser = getLoggedUser();

  // ** states
  // const [events, setEvents] = useState(useSelector((state) => state.events.events));
  const [storeList, setStoreList] = useState({});
  const [addSidebarOpen, setAddSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [calendarApi, setCalendarApi] = useState(null);
  const selectedMonth = localStorage.getItem('selectedMonth');
  const [currentMonth, setCurrentMonth] = useState(selectedMonth || moment().startOf('month').format('YYYY-MM'));
  // console.log('events', events);

  // ** Hooks
  const {
    control,
  } = useForm();

  // ** AddEventSidebar Toggle Function
  const handleAddEventSidebar = () => setAddSidebarOpen(!addSidebarOpen);

  // ** ViewEventModal Toggle Function
  const handleViewEventModal = () => setViewModalOpen(!viewModalOpen);

  // ** LeftSidebar Toggle Function
  const toggleSidebar = (val) => setLeftSidebarOpen(val);

  // ** Function to handle Add Event Click
  const handleAddEventClick = () => {
    // toggleSidebar(false);
    dispatch(selectEvent({}));
    handleAddEventSidebar();
  };

  // ** Blank Event Object
  const blankEvent = {
    title: '',
    start: '',
    end: '',
    allDay: false,
    url: '',
    extendedProps: {
      calendar: '',
      guests: [],
      location: '',
      description: '',
    },
  };

  // ** refetchEvents
  const refetchEvents = () => {
    if (calendarApi !== null) {
      calendarApi.refetchEvents();
    }
  };

  // ** Filter List
  // eslint-disable-next-line consistent-return
  const setCalEvents = async () => {
    await dispatch(fetchEvents());
    refetchEvents();
  };

  // ** Fetch Events On Mount
  useEffect(() => {
    dispatch(fetchEvents());
    dispatch(getStores({ vendor: loggedUser._id }));
  }, []);

  useEffect(() => {
    if (stores.data.length > 0) {
      setStoreList(stores.data.map((store) => ({ value: store._id, label: store.storeName })));
    }
  }, [stores?.data.length]);

  return (
    <>
      <div className="app-calendar overflow-hidden border">
        <Row noGutters>
          <Col
            id="app-calendar-sidebar"
            className={classnames('col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column', {
              show: leftSidebarOpen,
            })}
          >
            <SidebarLeft
              store={store}
              storeList={storeList}
              dispatch={dispatch}
              updateFilter={updateFilter}
              toggleSidebar={toggleSidebar}
              updateAllFilters={updateAllFilters}
              handleAddEventSidebar={handleAddEventSidebar}
            />
          </Col>
          <Col className="position-relative">
            <Calendar
              store={store.events}
              dispatch={dispatch}
              blankEvent={blankEvent}
              calendarApi={calendarApi}
              selectEvent={selectEvent}
              updateEvent={updateEvent}
              toggleSidebar={toggleSidebar}
              calendarsColor={calendarsColor}
              setCalendarApi={setCalendarApi}
              handleAddEventSidebar={handleAddEventSidebar}
              handleViewEventModal={handleViewEventModal}
              currentMonth={currentMonth}
            />
          </Col>
          {/* <div
            className={classnames('body-content-overlay', {
              show: leftSidebarOpen === true,
            })}
            onClick={() => toggleSidebar(false)}
          /> */}
        </Row>
      </div>
      <AddEventSidebar
        store={store}
        dispatch={dispatch}
        addEvent={addEvent}
        open={addSidebarOpen}
        selectEvent={selectEvent}
        updateEvent={updateEvent}
        removeEvent={removeEvent}
        calendarApi={calendarApi}
        refetchEvents={refetchEvents}
        calendarsColor={calendarsColor}
        handleAddEventSidebar={handleAddEventSidebar}
      />
      <ViewEventModal
        store={store}
        dispatch={dispatch}
        open={viewModalOpen}
        selectEvent={selectEvent}
        refetchEvents={refetchEvents}
        calendarsColor={calendarsColor}
        handleViewEventModal={handleViewEventModal}
      />

    </>
  );
};

export default CalendarComponent;
