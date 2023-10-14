/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import { addMedia } from '@store/actions/media.actions';

// import { addMedia } from '@store/actions/media.actions';
// import { getUsers } from './user.actions';

// ** Update Status to Deleted for any Record
export const updateRecord = (id, recordSource, data) => async (dispatch, getState) => {
  data.recordSource = recordSource;
  // console.log(apiUrl);
  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/records/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async (response) => {
      dispatch({
        type: 'GET_RECORD',
        selectedRecord: response.data,
      });
    })
    .then(() => {
      // dispatch(getMenus(getState().stores.params));
    })
    .catch((error) => {
      console.log(error);
    });
};
