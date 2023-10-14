/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
import { addMedia } from '@store/actions/media.actions';

// ** Get Order
// export const getOrder = (id) => async (dispatch, getState) => {
//   await axios
//     .get(`${process.env.REACT_APP_SERVER_URL}/api/orders/${id}`, { headers })
//     .then((response) => {
//       dispatch({
//         type: 'GET_ORDER',
//         selectedOrder: response.data,
//       });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// ** Add Order
export const addOrderNote = (data) => async (dispatch) => {
  await axios
    .post(`${process.env.REACT_APP_SERVER_URL}/api/orderNotes/create/`, data, {
      headers,
    })
    .then(async (response) => {
      dispatch({
        type: 'ADD_ORDER_NOTES',
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

// ** Get Order Notes
export const getOrderNotes = (params) => async (dispatch) => {
  axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/orderNotes/list/`, {
      headers,
      params,
    })
    .then((response) => {
      dispatch({
        type: 'GET_ORDER_NOTES',
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
// export const updateOrder = (id, data) => async (dispatch, getState) => {
//   await axios
//     .patch(
//       `${process.env.REACT_APP_SERVER_URL}/api/orders/update/${id}`,
//       data,
//       {
//         headers,
//       }
//     )
//     .then(async (response) => {
//       dispatch({
//         type: 'GET_ORDER',
//         selectedOrder: response.data.order,
//       });
//     })
//     .then(() => {
//       dispatch(getOrders(getState().orders.params));
//     })
//     .catch((err) => {
//       if (err.response) {
//         console.log(err.response.data);
//       } else {
//         console.log('Error', err.message);
//       }
//       throw err;
//     });
// };
