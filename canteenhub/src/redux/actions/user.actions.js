/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import { handleLogin } from '@store/actions/auth';

// ** Get all Data
export const getUsers = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_DATA',
      data: response.data.results,
      totalCount: response.data.totalCount,
      filteredCount: response.data.filteredCount,
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

// ** Get customers
export const getCustomers = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/customers`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_DATA',
      data: response.data.results,
      totalCount: response.data.totalCount,
      filteredCount: response.data.filteredCount,
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

// ** Get data on page or row change (DEPRECATE THIS IS POSSIBLE)
// export const getData = (params) => async (dispatch) => {
//   await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/`, { params, headers }).then((response) => {
//     dispatch({
//       type: 'GET_DATA',
//       data: response.data,
//       totalPages: response.data.total,
//       params,
//     });
//   }).catch((err) => {
//     if (err.response) {
//       console.log(err.response.data);
//     } else {
//       console.log('Error', err.message);
//     }
//     throw err;
//   });
// };

// ** Get User
export const getUser = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/users/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_USER',
        selectedUser: response.data,
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

// ** Get Me
export const getMe = () => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/users/user/me`, { headers })
    .then((response) => {
      dispatch(handleLogin(response.data));
      // dispatch({
      //   type: 'GET_ME',
      //   me: response.data,
      // });
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

// ** Update me
export const updateMe = (id, data) => async (dispatch) => {
  await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/users/update/${id}`, data, {
    headers,
  })
    .then(() => {
      dispatch({
        type: 'UPDATE_USER',
      });
    })
    .then(() => {
      dispatch(getMe());
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Add new user
// export const addUser = (user) => async (dispatch, getState) => {
//   axios
//     .post('/apps/users/add-user', user)
//     .then((response) => {
//       dispatch({
//         type: 'ADD_USER',
//         user,
//       });
//     })
//     .then(() => {
//       // dispatch(getData(getState().users.params));
//       dispatch(getUsers());
//     })
//     .catch((err) => console.log(err));
// };

// ** Update user
export const updateUser = (id, data) => async (dispatch) => {
  await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/users/update/${id}`, data, {
    headers,
  })
    .then(() => {
      dispatch({
        type: 'UPDATE_USER',
      });
    })
    .then(() => {
      // dispatch(getData(getState().users.params));
      dispatch(getUser(id));
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Delete user
export const deleteUser = (id) => async (dispatch, getState) => {
  await axios
    .delete(`${process.env.REACT_APP_SERVER_URL}/api/users/delete/${id}`, {
      headers,
    })
    .then(() => {
      dispatch({
        type: 'DELETE_USER',
      });
    })
    .then(() => {
      dispatch(getUsers(getState().users.params));
      // dispatch(getUsers());
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Approve user
export const approveUser = (id) => async (dispatch, getState) => {
  await axios
    .patch(`${process.env.REACT_APP_SERVER_URL}/api/users/approve/${id}`, {
      headers,
    })
    .then(() => {
      dispatch({
        type: 'UPDATE_USER',
      });
    })
    .then(() => {
      dispatch(getUsers(getState().users.params));
      // dispatch(getUsers());
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Decline user
export const declineUser = (id) => async (dispatch, getState) => {
  await axios
    .patch(`${process.env.REACT_APP_SERVER_URL}/api/users/decline/${id}`, {
      headers,
    })
    .then(() => {
      dispatch({
        type: 'UPDATE_USER',
      });
    })
    .then(() => {
      dispatch(getUsers(getState().users.params));
      // dispatch(getUsers());
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Add Admin
export const addAdmin = (user) => async (dispatch, getState) => {
  await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/administrators/create/`, user, {
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

// ** Get all Data
export const getAdmins = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/administrators/list/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_DATA',
      data: response.data.results,
      // totalCount: response.data.totalCount,
      // filteredCount: response.data.filteredCount,
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

// ** Get admin
export const getAdmin = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/administrators/fetch/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_USER',
        selectedUser: response.data,
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

// ** Update admin
export const updateAdmin = (id, data) => async (dispatch) => {
  await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/administrators/update/${id}`, data, {
    headers,
  })
    .then(() => {
      dispatch({
        type: 'UPDATE_USER',
      });
    })
    .then(() => {
      dispatch(getAdmin(id));
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// ** Delete admin
export const deleteAdmin = (id) => async (dispatch, getState) => {
  await axios
    .delete(`${process.env.REACT_APP_SERVER_URL}/api/administrators/delete/${id}`, {
      headers,
    })
    .then(() => {
      dispatch({
        type: 'DELETE_USER',
      });
    })
    .then(() => {
      dispatch(getUsers(getState().users.params));
      // dispatch(getUsers());
    }).catch((err) => {
      if (err.response) {
        console.log(err.response.data);
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};
