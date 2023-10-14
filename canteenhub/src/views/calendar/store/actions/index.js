import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Fetch Events
export const fetchEvents = (params) => (dispatch) => {
  const statusQuery = params && params.status ? `status=${params.status}&` : '';
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events/list/?${statusQuery}`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'FETCH_EVENTS',
      events: response.data.results,
    });
  }).catch((e) => {
    // eslint-disable-next-line no-console
    console.log(e);
  });
};

// ** Add Event
export const addEvent = (event) => (dispatch) => {
  axios.post(`${process.env.REACT_APP_SERVER_URL}/api/events/create/`, { event }).then(() => {
    dispatch({
      type: 'ADD_EVENT',
    });
    dispatch(fetchEvents());
  });
};

// ** Update Event
export const updateEvent = (event) => (dispatch) => {
  axios.post('/apps/calendar/update-event', { event }).then(() => {
    dispatch({
      type: 'UPDATE_EVENT',
    });
  });
};

// ** Filter Events
export const updateFilter = (filter) => (dispatch) => {
  // console.log('status', filters);

  // const statusFilter = filters. ? { status } : {};

  // dispatch({
  //   type: 'UPDATE_FILTERS',
  //   filters,
  // });

  dispatch(fetchEvents(filter));
  // console.log('getState().selectedCalendars', getState().events);
  // dispatch(fetchEvents(getState().selectedCalendars));
};

// ** Add/Remove All Filters
export const updateAllFilters = (value) => (dispatch, getState) => {
  dispatch({
    type: 'UPDATE_ALL_FILTERS',
    value,
  });
  dispatch(fetchEvents(getState().calendar.selectedCalendars));
};

// ** remove Event
export const removeEvent = (id) => (dispatch) => {
  axios.delete('/apps/calendar/remove-event', { id }).then(() => {
    dispatch({
      type: 'REMOVE_EVENT',
    });
  });
};

// ** Select Event (get event data on click)
export const selectEvent = (event) => (dispatch) => {
  dispatch({
    type: 'SELECT_EVENT',
    event,
  });
};
