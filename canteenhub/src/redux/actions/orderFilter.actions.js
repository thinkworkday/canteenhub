// ** Get get Order Filter
export const getOrderFilter = (data) => async (dispatch) => {
  dispatch({
    type: 'GET_ORDER_FILTER',
    orderFilter: data,
  });
};
