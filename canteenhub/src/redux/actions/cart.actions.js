/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Get Orders
export const getCartOrders = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/cartOrders/list/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_CART_ORDERS',
      data: response.data.results,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Order
export const getCartOrder = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/cartOrders/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_CART_ORDER',
        selectedOrder: response.data,
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

// ** Add Cart Order
export const addCartOrder = (order) => async (dispatch, getState) => {
  await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/cartOrders/create/`, order, {
    headers,
  })
    .then(async (response) => {
      dispatch({
        type: 'ADD_CART_ORDER',
        selectedOrder: response.data.order,
      });
    })
    .then(async () => {
      dispatch(getCartOrder(getState().cart.selectedOrder._id));
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

// ** Update Cart Order
export const updateCartOrder = (id, data) => async (dispatch) => {
  await axios.patch(`${process.env.REACT_APP_SERVER_URL}/api/cartOrders/update/${id}`, data, {
    headers,
  })
    .then(async (response) => {
      dispatch({
        type: 'GET_CART_ORDER',
        selectedOrder: response.data.order,
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

// ** Delete Cart Order
export const deleteCartOrder = (id) => async (dispatch) => {
  await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/cartOrders/delete/${id}`, {
    headers,
  })
    .then(async () => {
      // clear the state
      dispatch({
        type: 'GET_CART_ORDER',
        selectedOrder: null,
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
