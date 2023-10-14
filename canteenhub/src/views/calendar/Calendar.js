// ** React Import
import {
  useEffect, useRef, memo, Fragment, useState,
} from 'react';

import moment from 'moment';

// ** Full Calendar & it's Plugins
import FullCalendar from '@fullcalendar/react';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

// ** Custom Components
import Avatar from '@components/avatar';

// ** Third Party Components
import { toast } from 'react-toastify';
import { Card, CardBody } from 'reactstrap';
import { Menu, Check } from 'react-feather';

// ** Toast Component
const ToastComponent = ({ title, icon, color }) => (
  <>
    <div className="toastify-header pb-0">
      <div className="title-wrapper">
        <Avatar size="sm" color={color} icon={icon} />
        <h6 className="toast-title">{title}</h6>
      </div>
    </div>
  </>
);

const Calendar = (props) => {
  // ** Refs
  const calendarRef = useRef(null);
  const [calendarEvents, setCalendarEvents] = useState({});

  // ** Props
  const {
    store,
    dispatch,
    calendarsColor,
    calendarApi,
    setCalendarApi,
    // handleAddEventSidebar,
    handleViewEventModal,
    // blankEvent,
    toggleSidebar,
    selectEvent,
    updateEvent,
    currentMonth,
  } = props;

  // console.log('store', store.length);

  // ** UseEffect checks for CalendarAPI Update
  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi());
    } else if (currentMonth) {
      calendarApi.gotoDate(currentMonth);
    }

    // build Calendar event data
    const reformattedArray = store.map((event) => {
      // console.log('Start Date / Time: ', event.date, event.deliveryTime);

      const date = new Date(event.date);
      const formattedDate = moment(date).format('YYYY M D');
      const startDateTime = moment(new Date(`${formattedDate} ${event.deliveryTime}`)).format();

      return (event.status !== 'declined' ? {
        id: event._id,
        url: '',
        title: event.title,
        customHtml: `<div class='w-100'><strong> ${event.group.companyName}</strong></div><div class='w-100'><strong> ${event.store.storeName}</strong></div><div class='w-100'><small>${event.title}</small></div><div class='w-100'><small>${event.deliveryTime}</small> <small>${`(Cutoff: ${event.cutoffPeriod} hrs)`}</small> </div>`,
        start: startDateTime,
        end: moment(startDateTime).add(30, 'minutes').format(),
        allDay: false,
        extendedProps: {
          calendar: event.status,
        },

      } : {});
    });

    setCalendarEvents(reformattedArray);
  }, [calendarApi, setCalendarEvents, store]);

  // const date = new Date();
  // const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  // prettier-ignore
  // const nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1);
  // prettier-ignore
  // const prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1);

  // ** calendarOptions(Props)
  const calendarOptions = {
    // events: store?.events.length ? store.events : [],
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    events: calendarEvents,
    headerToolbar: {
      start: 'sidebarToggle, prev,next, title',
      end: 'dayGridMonth,listMonth',
    },
    editable: false,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 4,
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      // eslint-disable-next-line no-underscore-dangle
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar];
      return [`bg-light-${colorName}`];
    },

    // eventClick(calEvent, jsEvent, view) {
    //   console.log(calEvent);
    //   console.log(jsEvent);
    //   console.log(view);
    // },

    eventClick({ event: clickedEvent }) {
      const eventId = clickedEvent._def.publicId;

      const eventStore = store.find((element) => element._id === eventId);
      dispatch(selectEvent(eventStore));

      // display view
      handleViewEventModal();
      // handleAddEventSidebar();

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      // event.value = grabEventDataFromEventApi(clickedEvent)

      // eslint-disable-next-line no-use-before-define
      // isAddNewEventSidebarActive.value = true
    },

    customButtons: {
      sidebarToggle: {
        text: <Menu className="d-xl-none d-block" />,
        click() {
          toggleSidebar(true);
        },
      },
    },

    // dateClick(info) {
    //   // const ev = blankEvent;
    //   // ev.start = info.date;
    //   // ev.end = info.date;
    //   // dispatch(selectEvent(ev));
    //   // handleAddEventSidebar();
    // },

    /*
      Handle event drop (Also include dragged event)
      ? Docs: https://fullcalendar.io/docs/eventDrop
      ? We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
    */
    // eventDrop({ event: droppedEvent }) {
    //   dispatch(updateEvent(droppedEvent));
    //   toast.success(<ToastComponent title="Event Updated" color="success" icon={<Check />} />, {
    //     autoClose: 2000,
    //     hideProgressBar: true,
    //     closeButton: false,
    //   });
    // },

    /*
      Handle event resize
      ? Docs: https://fullcalendar.io/docs/eventResize
    */
    eventResize({ event: resizedEvent }) {
      dispatch(updateEvent(resizedEvent));
      toast.success(<ToastComponent title="Event Updated" color="success" icon={<Check />} />, {
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
      });
    },

    eventContent(eventInfo) {
      return { html: eventInfo.event.extendedProps.customHtml };
    },

    ref: calendarRef,
  };

  const handleMonthChange = (selected) => {
    const { start, end } = selected;
    if (end.getMonth() - start.getMonth() > 1) {
      localStorage.setItem('selectedMonth', moment(end).subtract(1, 'months').format('YYYY-MM'));
    } else {
      localStorage.setItem('selectedMonth', moment(end).format('YYYY-MM'));
    }
  };

  return (
    <Card className="shadow-none border-0 mb-0 rounded-0">
      <CardBody className="pb-0">
        <FullCalendar {...calendarOptions} datesSet={handleMonthChange} />
        {' '}
      </CardBody>
    </Card>
  );
};

export default memo(Calendar);
