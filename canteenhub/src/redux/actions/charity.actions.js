/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import { addMedia } from '@store/actions/media.actions';

// ** Get Charities
export const getCharities = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/charities/list/`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_CHARITIES',
        data: response.data.results,
        totalCount: response.data.totalCount,
        filteredCount: response.data.filteredCount,
        params,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Get Charity
export const getCharity = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/charities/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_CHARITY',
        selectedCharity: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Add Charity
export const addCharity = (charity) => async (dispatch) => {
  const charityLogo = charity.charityLogo ? charity.charityLogo : '';
  delete charity.charityLogo;

  console.log('ADD this', charity);

  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/charities/create/`, charity, {
      headers,
    })
    .then(async (response) => {
      console.log('response', response);
      const charityObjId = response.data.charity._id;
      dispatch({
        type: 'ADD_CHARITY',
        selectedCharity: response.data.charity,
      });
      // Add Logo if Populated
      if (charityLogo) {
        await dispatch(addMedia(charityLogo, charityObjId, 'Charity', 'charityLogo'));
      }
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

// ** Update Charity
export const updateCharity = (id, data) => async (dispatch, getState) => {
  const charityLogo = data.charityLogo ? data.charityLogo : '';
  delete data.charityLogo;

  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/charities/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async () => {
      dispatch({
        type: 'UPDATE_STORE',
      });
      // Update Logo if Populated
      if (charityLogo) {
        await dispatch(addMedia(charityLogo, id, 'Charity', 'charityLogo'));
      }
    })
    .then(() => {
      // dispatch(getData(getState().users.params));
      dispatch(getCharity(id));
      dispatch(getCharities(getState().charities.params));
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

// ** Delete Store
// export const deleteStore = (id) => async (dispatch, getState) => {
//   await axios
//     .patch(`${process.env.REACT_APP_SERVER_URL}/api/store/update/${id}`, {
//       headers,
//     })
//     .then((response) => {
//       console.log(response);
//       dispatch({
//         type: 'UPDATE_STORE',
//       });
//     })
//     .then(() => {
//       // console.log(getState());
//       // dispatch(getStoreUsers(getState().users.params));
//       dispatch(getStores(getState().users.params));
//       // dispatch(getUsers());
//     }).catch((err) => {
//       if (err.response) {
//         console.log(err.response.data);
//       } else {
//         console.log('Error', err.message);
//       }
//       throw err;
//     });
// };
