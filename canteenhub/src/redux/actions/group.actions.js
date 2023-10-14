/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
// import { addMedia } from '@store/actions/media.actions';
import { getInvites } from '@store/actions/invite.actions';
// import { getUsers } from './user.actions';

// ** Get Groups
export const getGroups = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/groups/list`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_GROUPS',
        data: response.data.results,
        // totalCount: response.data.totalCount,
        // filteredCount: response.data.filteredCount,
        params,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Get Group
export const getGroup = (groupId) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/groups/${groupId}`, {
      headers,
    })
    .then((response) => {
      dispatch({
        type: 'GET_GROUP',
        group: response.data,
        // totalCount: response.data.totalCount,
        // filteredCount: response.data.filteredCount,
        // params,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Find Groups by Postcode
export const findGroupsByPostcode = (postcode) => async (dispatch) => {
  axios
    .get(
      `${process.env.REACT_APP_SERVER_URL}/api/groups/findByPostcode/${postcode}`,
      {
        headers,
      }
    )
    .then((response) => {
      dispatch({
        type: 'GET_GROUPS',
        data: response.data.results,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Find Groups by Postcode
export const findGroupsBySchoolName = (schoolname) => async (dispatch) => {
  axios
    .get(
      `${process.env.REACT_APP_SERVER_URL}/api/groups/findBySchoolName/${schoolname}`,
      {
        headers,
      }
    )
    .then((response) => {
      dispatch({
        type: 'GET_GROUPS',
        data: response.data.results,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// // ** Get Groups= Invites
// export const getGroupInvites = (params) => async (dispatch) => {
//   axios.get(`${process.env.REACT_APP_SERVER_URL}/api/groups/invites`,
//     {
//       headers,
//       params,
//     }).then((response) => {
//     dispatch({
//       type: 'GET_GROUPS',
//       data: response.data.results,
//       totalCount: response.data.totalCount,
//       filteredCount: response.data.filteredCount,
//       params,
//     });
//   }).catch((e) => {
//     console.log(e);
//   });
// };

// ** Invite Groups
export const inviteGroup = (inviteData) => async (dispatch) => {
  await axios
    .post(
      `${process.env.REACT_APP_SERVER_URL}/api/invites/create/`,
      inviteData,
      {
        headers,
      }
    )
    .then(async (response) => {
      dispatch({
        type: 'ADD_INVITE',
        selectedInvite: response.data.invite,
      });
    })
    .then(() => {
      dispatch(getInvites('pending'));
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

// ** Get Subgroups
export const getSubgroups = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/subgroups/list/`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_RECORDS',
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
    .catch((error) => {
      console.log(error);
    });
};

// ** Add Subgroup
export const addSubgroup = (subgroup) => async (dispatch) => {
  await axios
    .post(
      `${process.env.REACT_APP_SERVER_URL}/api/subgroups/create/`,
      subgroup,
      {
        headers,
      }
    )
    .then(async (response) => {
      dispatch({
        type: 'ADD_RECORD',
        selectedRecord: response.data.subgroup,
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

// ** Update Subgroup
export const updateSubgroup = (id, data) => async (dispatch, getState) => {
  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/subgroups/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async (response) => {
      console.log(response);
      dispatch({
        type: 'GET_RECORD',
        selectedRecord: response.data,
      });
    })
    .then(() => {
      // dispatch(getData(getState().users.params));
      // dispatch(getStore(id));
      dispatch(getSubgroups(getState().stores.params));
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
