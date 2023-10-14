/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';

// ** Get Order
export const getOrder = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/orders/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_ORDER',
        selectedOrder: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

// ** Add Order
export const addOrder = (order) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/orders/create/`, order, {
      headers,
    })
    .then(async (response) => {
      dispatch({
        type: 'ADD_ORDER',
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

// ** Get Orders
export const getOrders = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/orders/list/`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_ORDERS',
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

// ** Update Order
export const updateOrder = (id, data) => async (dispatch, getState) => {
  await axios
    .patch(
      `${process.env.REACT_APP_SERVER_URL}/api/orders/update/${id}`,
      data,
      {
        headers,
      }
    )
    .then(async (response) => {
      dispatch({
        type: 'GET_ORDER',
        selectedOrder: response.data.order,
      });
    })
    .then(() => {
      dispatch(getOrders(getState().orders.params));
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

// ** Cancel & Refund Order
export const cancelOrder = (id, setApiErrors) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/orders/cancel/${id}`, {
      headers,
    })
    .then(async (response) => {
      dispatch({
        type: 'GET_ORDER',
        selectedOrder: response.data,
      });
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response.data);
        setApiErrors({ data: err.response.data.raw.message });
      } else {
        console.log('Error', err.message);
      }
      throw err;
    });
};

// Get Pending OrderNotes
export const getPendingOrderNotes = () => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/orders/orderNotes/pendingList/`, {
      headers,
    })
    .then((response) => {
      dispatch({
        type: 'GET_ORDER_NOTES_PENDING',
        data: response.data.results,
        totalCount: response.data.totalCount,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
