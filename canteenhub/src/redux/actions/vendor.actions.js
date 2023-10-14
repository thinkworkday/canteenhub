/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import { addMedia } from '@store/actions/media.actions';
import { getUsers } from './user.actions';

// ** Get Stores
export const getStores = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/stores/`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_STORES',
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

// ** Get Store
export const getStore = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/stores/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_STORE',
        selectedStore: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Add Store
export const addStore = (store) => async (dispatch) => {
  const storeLogo = store.storeLogo ? store.storeLogo : '';
  delete store.storeLogo;

  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/stores/create/`, store, {
      headers,
    })
    .then(async (response) => {
      const storeObjId = response.data.store._id;
      dispatch({
        type: 'ADD_STORE',
        selectedStore: response.data.store,
      });
      // Add Logo if Populated
      if (storeLogo) {
        await dispatch(addMedia(storeLogo, storeObjId, 'Store', 'storeLogo'));
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

// ** Update Store
export const updateStore = (id, data) => async (dispatch, getState) => {
  const storeLogo = data.storeLogo ? data.storeLogo : '';
  delete data.storeLogo;

  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/stores/update/${id}`,
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
      if (storeLogo) {
        await dispatch(addMedia(storeLogo, id, 'Store', 'storeLogo'));
      }
    })
    .then(() => {
      // dispatch(getData(getState().users.params));
      dispatch(getStore(id));
      dispatch(getStores(getState().stores.params));
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

// ** Add Store User
export const addStoreUser = (user) => async (dispatch, getState) => {
  // console.log(user);
  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/storeUsers/create/`, user, {
      headers,
    })
    .then(() => {
      dispatch({
        type: 'ADD_USER',
        user,
      });
    })
    .then(() => {
      dispatch(getUsers(getState().users.params));
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

// ** Get Store Users
export const getStoreUsers = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/storeUsers/list/`, {
      headers,
      params,
    })
    .then((response) => {
      // console.log('response', response);
      dispatch({
        type: 'GET_DATA',
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

// ** Get Store User
export const getStoreUser = (id) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/storeUsers/user/${id}`, {
      headers,
    })
    .then((response) => {
      dispatch({
        type: 'GET_USER',
        selectedUser: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Delete user
export const deleteStoreUser = (id) => async (dispatch, getState) => {
  await axios
    .delete(`${process.env.REACT_APP_SERVER_URL}/api/storeUsers/delete/${id}`, {
      headers,
    })
    .then(() => {
      dispatch({
        type: 'DELETE_USER',
      });
    })
    .then(() => {
      dispatch(getStoreUsers(getState().users.params));
      // dispatch(getUsers());
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

// ** Add Store
export const addBankAccount = (store, cb) => {
  axios
    .post(
      `${process.env.REACT_APP_SERVER_URL}/api/stores/stripe/connectedAccount/generateUrl/`,
      store,
      {
        headers,
      }
    )
    .then(async (response) => {
      const url = response.data;
      cb(null, url);
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      cb(err);
      throw err;
    });
};

// ** Add Store
export const updateToken = (data) => {
  axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/stores/token`, data, {
      headers,
    })
    // .then(async (response) => {
    //   const url = response.data;
    //   // cb(null, url);
    // })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      // cb(err);
      throw err;
    });
};
