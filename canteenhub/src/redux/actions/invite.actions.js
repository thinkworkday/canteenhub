/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Get Invites
export const getInvites = (status) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/invites/list/${status}`,
    {
      headers,
    }).then((response) => {
    dispatch({
      type: 'GET_INVITES',
      data: response.data.results,
      totalCount: response.data.totalCount,
      filteredCount: response.data.filteredCount,
      // params,
    });
  }).catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      window.location.href = '/misc/not-connected';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });
};

// ** Get Invites Receieved
export const getInvitesReceived = (status) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/invites/received/${status}`,
    {
      headers,
    }).then((response) => {
    dispatch({
      type: 'GET_INVITES',
      data: response.data.results,
      totalCount: response.data.totalCount,
      filteredCount: response.data.filteredCount,
      // params,
    });
  }).catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      window.location.href = '/misc/not-connected';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });
};

// ** Get Invite
export const getInvite = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/invites/${id}`, { headers })
    .then((response) => {
      // console.log('store response', response);
      dispatch({
        type: 'GET_INVITE',
        selectedInvite: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Accept Invite
export const acceptInvite = (id) => async (dispatch) => {
  // console.log('acceptInvite', id);
  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/invites/accept/${id}`, { headers })
    .then((response) => {
      // console.log('store response', response);
      dispatch({
        type: 'GET_INVITE',
        selectedInvite: response.data,
      });
    })
    .catch((err) => console.log(err));
};

// ** Decline Invite
export const declineInvite = (id) => async (dispatch) => {
  // console.log('acceptInvite', id);
  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/invites/decline/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_INVITE',
        selectedInvite: response.data,
      });
    })
    .catch((err) => console.log(err));
};
