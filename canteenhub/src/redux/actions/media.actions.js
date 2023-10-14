/* eslint-disable no-console */
import axios from 'axios';
import { headersMedia } from '@configs/apiHeaders.js';
// import { getUsers } from './user.actions';

// ** Upload File
export const addMedia = (mediaFile, resourceObjId, resourceType, resourceField) => async (dispatch, getState) => {
  const formData = new FormData();
  formData.append('mediaFile', mediaFile[0].file);
  formData.append('resourceObjId', resourceObjId);
  formData.append('resourceType', resourceType);
  formData.append('resourceField', resourceField);

  await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/media/upload/`, formData, {
    headersMedia,
  })
    .then((response) => {
      console.log('Media Upload Resp');

      // Upload

      // dispatch({
      //   type: 'ADD_MEDIA',
      //   mediaFile,
      // });
    })
    // .then(() => {
    //   dispatch(getStores(getState().users.params));
    //   dispatch(getUsers());
    // })
    .catch((err) => {
      console.log('Media Upload Error');
      console.log(err);

      if (err.response) {
        console.log(err.response.data);
        // console.log(err.response.status);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};
