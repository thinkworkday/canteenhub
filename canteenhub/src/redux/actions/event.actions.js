/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Fetch Event
export const fetchEvent = (eventId) => (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events/v2/${eventId}`,
    {
      headers,
      // data,
    }).then((response) => {
    dispatch({
      type: 'SELECT_EVENT',
      event: response.data,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Fetch Events
export const fetchEvents = (params, status) => (dispatch) => {
  const statusQuery = status ? `status=${status}` : '';
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events/list/?${statusQuery}`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'FETCH_EVENTS',
      events: response.data.results,
      params,
    });
  }).catch((err) => {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log('Error', err.message);
    }
    throw err;
  });
};

// ** Fetch Upcoming Events
export const fetchUpcomingEvents = (profileId) => (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/events/upcoming/${profileId}`,
    {
      headers,
    }).then((response) => {
    dispatch({
      type: 'FETCH_EVENTS',
      events: response.data.results,
    });
  }).catch((err) => {
    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log('Error', err.message);
    }
    throw err;
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
export const updateEvent = (id, data) => async (dispatch) => {
  await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/events/update/${id}`, data, {
    headers,
  })
    .then(async (response) => {
      dispatch({
        type: 'UPDATE_EVENT',
        selectedEvent: response.data.event,
      });
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Update Event Status
export const updateEventStatus = (data) => async (dispatch) => {
  await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/events/updateStatus/`, data, {
    headers,
  })
    .then(async (response) => {
      dispatch({
        type: 'SELECT_EVENT',
        events: response.data.results,
      });
    })
    // .then(() => {
    //   dispatch(fetchEvent(getState().events.selectedEvent._id));
    // })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Fulfill Event
export const fulfillEvent = (id, ordersFulfilled) => async (dispatch) => {
  await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/events/fulfillEvent/${id}`, { ordersFulfilled }, {
    headers,
  })
    .then(async (response) => {
      dispatch({
        type: 'SELECT_EVENT',
        event: response.data,
      });
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Filter Events
export const updateFilter = (filter) => (dispatch, getState) => {
  dispatch({
    type: 'UPDATE_FILTERS',
    filter,
  });
  dispatch(fetchEvents(getState().calendar.selectedCalendars));
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
