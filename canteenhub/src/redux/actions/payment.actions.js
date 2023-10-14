/* eslint-disable no-console */
import axios from 'axios';
import { headers } from '@configs/apiHeaders.js';
// import { addMedia } from '@store/actions/media.actions';
// import { getInvites } from '@store/actions/invite.actions';
// import { getUsers } from './user.actions';

// ** Get get Vendor Payout Transactops
export const getTransactions = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/payments/transactions/list/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_TRANSACTIONS',
      data: response.data.results,
      totalCount: response.data.totalCount,
      filteredCount: response.data.filteredCount,
      params,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get  Customer Transactions
export const getCustomerTransactions = (params) => async (dispatch) => {
  axios.get(`${process.env.REACT_APP_SERVER_URL}/api/payments/customer/transactions/list/`,
    {
      headers,
      params,
    }).then((response) => {
    dispatch({
      type: 'GET_TRANSACTIONS',
      data: response.data.results,
      totalCount: response.data.totalCount,
      filteredCount: response.data.filteredCount,
      params,
    });
  }).catch((e) => {
    console.log(e);
  });
};

// ** Get Customer Transaction
export const getCustomerTransaction = (id) => async (dispatch) => {
  await axios
    .get(`${process.env.REACT_APP_SERVER_URL}/api/payments/customer/transaction/${id}`, { headers })
    .then((response) => {
      dispatch({
        type: 'GET_TRANSACTION',
        selectedTransaction: response.data,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
