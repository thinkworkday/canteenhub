/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
// import { addMedia } from '@store/actions/media.actions';
// import { getInvites } from '@store/actions/invite.actions';
// import { getUsers } from './user.actions';

// ** Add Profile
export const addProfile = (subgroup) => async (dispatch) => {
  await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/profiles/create/`, subgroup, {
    headers,
  })
    .then(async (response) => {
      dispatch({
        type: 'ADD_RECORD',
        selectedRecord: response.data.profile,
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

// ** Get getProfiles
export const getProfiles = (params, customerId) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/profiles/list/${customerId}`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_PROFILES',
      data: response.data.results,
      totalCount: response.data.totalCount,
      filteredCount: response.data.filteredCount,
      params,
    });
  }).catch((err) => {
    console.log('ERROR');

    if (err.response) {
      console.log(err.response.data);
    } else {
      console.log('Error', err.message);
    }
    throw err;
  });
};

// ** Get Profile
export const getProfile = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/profiles/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_PROFILE',
        selectedProfile: response.data,
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

// ** Select Profil (from store)
export const selectProfile = (profile) => (dispatch) => {
  dispatch({
    type: 'SELECT_PROFILE',
    profile,
  });
};

// ** Get Subgroup
export const getSubgroup = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/subgroups/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_RECORD',
        selectedRecord: response.data,
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

// ** Update Profile
export const updateProfile = (id, data) => async (dispatch, getState) => {
  if (data.allergies) {
    data.allergies = data.allergies.filter((e) => e);
  }

  await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/profiles/update/${id}`, data, {
    headers,
  })
    .then(async (response) => {
      dispatch({
        type: 'GET_RECORD',
        selectedRecord: response.data,
      });
    })
    .then(() => {
      // dispatch(getData(getState().users.params));
      dispatch(getProfiles(getState().stores.params));
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};
