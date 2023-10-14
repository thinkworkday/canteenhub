/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Get Order
export const getTestModeStatus = () => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/testModes`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_TEST_MODE_DATA',
        testModeStatus: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
