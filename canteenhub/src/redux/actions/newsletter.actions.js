/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Get Newsletter
export const getNewsletter = () => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/newsletter/`,
    {
      headers,
    }).then((response) => {
    dispatch({
      type: 'GET_NEWSLETTER',
      data: response.data.result,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Add Or Update Newsletter
export const addUpdateNewsletter = (newsletter) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/newsletter/createOrUpdate`, newsletter, {
      headers,
    })
    .then(async (response) => {
      dispatch({
        type: 'GET_NEWSLETTER',
        data: response.data.content,
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

export const getNewsletterView = () => async (dispatch) => {
  dispatch({ type: 'GET_NEWSLETTER_VIEW_REQUEST' });
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/newsletter/view`).then((response) => {
    dispatch({
      type: 'GET_NEWSLETTER_VIEW',
      data: response.data.result,
    });
  }).catch((e) => {
    console.log(e);
  });
};
